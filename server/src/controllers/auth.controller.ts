import express, { Request, Response, NextFunction, Router } from "express";
import User from "../models/user.model";
import middleware from "../utils/middlewares";
import logger from "../utils/logger";
import { userValidation, validate } from "../utils/validator";
import {
  hashPassword,
  updateUserInfo,
  validateUserPassword,
} from "../services/auth.service";
import { StatusCodes } from "http-status-codes";

const authRouter: Router = express.Router();

authRouter.get(
  "/check",
  middleware.isLoggedIn,
  (req: Request, res: Response): void => {
    const session = req.session;

    if (session?.user) {
      res.json({
        username: session.user.username,
        name: session.user.name,
        id: session.user.id,
      });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).end();
    }
  }
);

authRouter.post(
  "/register",
  middleware.isNotLoggedIn,
  validate(userValidation),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password, name } = req.body;

    try {
      const user = await User.findOne({ username });
      if (user) {
        res.status(StatusCodes.CONFLICT).json({
          error: "username conflict",
        });
        return;
      }

      await new User({
        password: await hashPassword(password),
        username,
        name,
      }).save();

      res.json({ username, name });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
);

authRouter.post(
  "/login",
  middleware.isNotLoggedIn,
  validate(userValidation),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;

    try {
      const user = await validateUserPassword({
        username,
        password,
      });

      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          error: "Unauthorized access",
        });
        return;
      }

      const updated = await updateUserInfo(
        { username },
        {
          ...user.toJSON(),
          ip_address: req.ip,
          last_login: new Date().toISOString(),
        }
      );
      if (updated) {
        req.session!.user = {
          id: user.get("id"),
          name: user.get("name"),
          username,
        };
      }

      res.json({ username, id: user.get("id"), name: user.get("name") });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
);

authRouter.post(
  "/logout",
  middleware.isLoggedIn,
  (req: Request, res: Response, next: NextFunction): void => {
    req.session!.destroy((err) => {
      if (err) {
        logger.error(err);
        next();
      } else {
        res.clearCookie("session-cookie").redirect("/");
      }
    });
  }
);

authRouter.put(
  "/reset",
  middleware.isLoggedIn,
  validate(userValidation),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password, oldPassword, name } = req.body;

    try {
      const user = await validateUserPassword({
        username,
        password: oldPassword,
      });
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          error: "Unauthorized access",
        });
        return;
      }

      const updated = await updateUserInfo(
        { username },
        {
          ...user.toJSON(),
          password: await hashPassword(password),
          name,
        }
      );

      if (updated) {
        req.session!.destroy((err) => {
          if (err) {
            logger.error(err);
            next();
          } else {
            res.clearCookie("session-cookie").end();
          }
        });
      }
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
);

authRouter.delete(
  "/unregister",
  middleware.isLoggedIn,
  validate(userValidation),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;

    try {
      const user = await validateUserPassword({
        username,
        password,
      });
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          error: "Unauthorized access",
        });
        return;
      }

      const deleted = await updateUserInfo(
        { username },
        {
          ...user.toJSON(),
          deactivated: true,
        }
      );
      if (deleted) {
        req.session!.destroy((err) => {
          if (err) {
            logger.error(err);
            next();
          } else {
            res
              .clearCookie("session-cookie")
              .status(StatusCodes.NO_CONTENT)
              .end();
          }
        });
      } else {
        res.status(StatusCodes.BAD_REQUEST).end();
      }
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
);

export default authRouter;

import React from 'react';
import { Rating } from 'semantic-ui-react';
import { RatingProps } from '../types';

const RatingBar: React.FC<RatingProps> = ({ rating }: RatingProps): JSX.Element => {
    return (
        <div className='rating-bar'>
            <Rating icon='star' disabled rating={ rating } maxRating={ 5 }/>
        </div>
    );
};

export default RatingBar;
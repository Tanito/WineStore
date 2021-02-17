import React from 'react';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import './ReviewCard.modules.css';

function ReviewCard(props) {
  return (
    <>
      <Box component="fieldset" mt={3} borderColor="transparent">
        <Rating value={props.data.points} readOnly />
      </Box>
      <h4 className="description">{props.data.description}</h4>
      <p className="date">{props.data.createdAt.slice(0, 10)}</p>
      <h5 className="client">
        {props.data.firstName + ' ' + props.data.lastName}
      </h5>
      {/* COMENTÉ EL NOMBRE PORQUE ESO HACER QUE ROMPA SI BORRAMOS UN USER */}
    </>
  );
}

export default ReviewCard;

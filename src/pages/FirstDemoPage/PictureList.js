import React from 'react';

import {Card} from "semantic-ui-react";
import PictureItem from "./PictureItem";

const PictureList = ({
  pictures, onClearCommand, onCancelCommand,rows
}) => (
  <Card.Group itemsPerRow={rows}>
    {pictures.map(picture => (
      <PictureItem
        key={picture.uid}
        demo = {picture.uid}
        picture={picture}
        onClearCommand={onClearCommand}
        onCancelCommand={onCancelCommand}
      />
    ))}
  </Card.Group>
);

export default PictureList;

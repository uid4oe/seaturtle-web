import React from "react";
import Card from "semantic-ui-react/dist/commonjs/views/Card";
import PictureMapModal from "./PictureMapModal";

function PictureItem(props) {
  return (
    <Card>
      <Card.Content>
        <PictureMapModal picture={props.picture}/>
      </Card.Content>
    </Card>
  );
}

export default PictureItem;

import React from 'react';
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import {useSelector} from "react-redux";
import Button from "@material-ui/core/Button";

const boxStyle = {
  marginTop: '10px',
  padding: '5px',
  textAlign: 'center'
};

function HystoryList({displayMap}) {

  const list = useSelector((state) => state.map);

  const handleClick = (el) => {
    displayMap(el.coords, el.closed)
  };

  return (
    <Container>
      {
        list && list.history
          ?
          list.history.map((el, i) => (
            <Box key={el.name + i} style={boxStyle} bgcolor="palevioletred">
              {el.name}
              <Button variant="contained" color="primary" onClick={() => handleClick(el)}>
                Replay
              </Button>
            </Box>
          ))
          :
          null

      }
    </Container>
  )
}

export default HystoryList

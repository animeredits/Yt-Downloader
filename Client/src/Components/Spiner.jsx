import React from "react";
import loading from "../assets/8UiQ.gif";
const Spiner = () => {
  return (
    <>
      <div className="spiner"style={{textAlign:"center"}}>
        <img src={loading} alt="loading" width="170px" />
      </div>
    </>
  );
};
export default Spiner;

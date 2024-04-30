import React from "react";
import Topics from "../../components/Topics";
import Rooms from "../../components/Rooms";
const Index = () => {
  return (
    <div className="w-1/2 mx-auto mt-20 flex flex-col gap-10">
      <Topics />
      <Rooms />
    </div>
  );
};

export default Index;

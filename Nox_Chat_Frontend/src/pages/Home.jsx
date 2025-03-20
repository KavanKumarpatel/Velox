import React from "react";
import AppLayout from "../components/AppLayout/AppLayout";


const Home = ({userdata}) => {


  return (
      <section className="chatdefault" >
      <div className="person-dp">
        <img src="NoxChatLogo.png" alt="" className="person-image" />
      </div>
      <h1>Welcome To Project Velox</h1>
      <p>
        Your personal messages are not <strong>end-to-end encrypted</strong>
      </p>
    </section>
  );
};

export default AppLayout()(Home);

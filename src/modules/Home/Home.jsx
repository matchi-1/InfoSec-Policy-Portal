import React from "react";
import "./styles/Home.css";

const BodyContent = () => {
    return (
        <div className="home">
            <div className="body-content-container">
                <p>Hello Home Module!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
                <p>If you're going to style with css, use your unique namespace '.home' at the start.</p>
            </div>
        </div>
    );
};

export default BodyContent;

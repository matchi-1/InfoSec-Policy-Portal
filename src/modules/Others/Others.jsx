import React from "react";
import "./styles/Others.css";

const BodyContent = () => {
    return (
        <div className="others">
            <div className="body-content-container">
                <p>Hello Others Module!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
                <p>If you're going to style with css, use your unique namespace '.others' at the start.</p>
            </div>
        </div>
    );
};

export default BodyContent;

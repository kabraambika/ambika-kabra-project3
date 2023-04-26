import React from "react";
import Feed from "./feed/Feed";
import './Timeline.css'

// Timeline component is used as home page showing all posts
function Timeline() {
    return (
        <div className="custom-wrapper Timeline">
            <Feed/>
        </div>
    );
}

export default Timeline;
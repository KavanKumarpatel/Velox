import React from "react";
import ReactPlayer from "react-player/lazy";
import { fileFormat, transformImage } from "../../lib/features";
import { FileOpen } from "@mui/icons-material";



const RenderAttachment = (file, url) => {

  switch(file) {

    case 'video' :
        return  <video src={url} preload="none" width={'900px'}  controls />


    case 'image' :
        return  <img src={transformImage(url, 800)} alt="Attachment" width={'300px'} height={'200px'} style={{objectFit: 'cover', borderRadius: '1rem'}}/>

    case 'audio' :
        return <audio src={url} preload="none" controls/>

        default:
            return <FileOpen sx={{width: "50px", height: "50px"}}/>
  }
};

export default RenderAttachment;

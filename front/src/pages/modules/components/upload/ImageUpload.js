import React, {
  useState,
} from 'react';
import ImageUploading from 'react-images-uploading';
import {
  IconButton,
  ButtonBase,
} from '@material-ui/core';
import {
  Add,
  Delete,
} from '@material-ui/icons';
import './index.scss';
import { classNames } from '../../../../utils'; 

const ImageUpload = ({ handleImageUpload }) => {
  const [images, setImages] = useState([]);
  const maxImageSize = 1048576; // max size to 1MB

  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
    // call back with image base 64 string format
    handleImageUpload(imageList[0].data_url)
  };

  return (
    <div className="image-upload">
      <ImageUploading
        multiple={false}
        value={images}
        onChange={onChange}
        maxFileSize={maxImageSize}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemove,
          isDragging,
          dragProps,
          errors,
        }) => (
          <React.Fragment>
            <div className="upload__image-wrapper">
              <ButtonBase
                className="upload-button"
                onClick={onImageUpload}
                {...dragProps}
              >
                +
              </ButtonBase>
              {
                imageList.map((image, index) => (
                  <div 
                    key={index}
                    className="image-item"
                    style={{backgroundImage: `url(${image['data_url']})`}}
                  >
                    {/* <img src={image['data_url']} alt="" width="100" /> */}
                    <div className="image-item__btn-wrapper">
                      <IconButton
                        size="small"
                        onClick={() => onImageRemove(index)}
                      >
                        <Delete/>
                      </IconButton>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className={classNames(['error', errors ? '': 'hidden'])}>
              {errors.acceptType && (
                <span>File type is not allow</span>
              )}
              {errors.maxFileSize && (
                <span>Max image size 1MB</span>
              )}
            </div>
          </React.Fragment>
        )}
      </ImageUploading>
    </div>
  );
}

export default ImageUpload;

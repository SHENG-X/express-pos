import React, {
  useState,
} from 'react';
import ImageUploading from 'react-images-uploading';
import {
  IconButton,
  ButtonBase,
} from '@material-ui/core';
import {
  Delete,
} from '@material-ui/icons';
import PropTypes from 'prop-types';

import './index.scss';
import { classNames, imagePath } from '../../../../utils';

const ImageUpload = ({ handleImageUpload, obj }) => {
  const [images, setImages] = useState([]);
  const maxImageSize = 1048576; // max size to 1MB

  const onChange = (imageList) => {
    setImages(imageList);
    // call back with image base 64 string format
    handleImageUpload(imageList[0]?.data_url);
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
          dragProps,
          errors,
        }) => (
          <>
            <div className="upload__image-wrapper" style={{ backgroundImage: `url(${imagePath(obj.thumbnailFileName)})` }}>
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
                    className="image-item"
                    style={{ backgroundImage: `url(${image.data_url})` }}
                    key={`${image.data_url}`}
                  >
                    <div className="image-item__btn-wrapper">
                      <IconButton
                        size="small"
                        onClick={() => onImageRemove(index)}
                      >
                        <Delete />
                      </IconButton>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className={classNames(['error', errors ? '' : 'hidden'])}>
              {errors.acceptType && (
                <span>File type is not allow</span>
              )}
              {errors.maxFileSize && (
                <span>Max image size 1MB</span>
              )}
            </div>
          </>
        )}
      </ImageUploading>
    </div>
  );
};

ImageUpload.propTypes = {
  handleImageUpload: PropTypes.func.isRequired,
  obj: PropTypes.instanceOf(PropTypes.object).isRequired,
};

export default ImageUpload;

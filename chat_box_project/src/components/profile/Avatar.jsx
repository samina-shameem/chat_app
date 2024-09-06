import React from 'react';
import Image from 'react-bootstrap/Image';
import defaultAvatar from '../../assets/images/defaultAvatar.jpeg';

const Avatar = ({ src }) => {
  const getAvatarContent = () => {
    if (src) {
      // Check if the src is an image link
      if (src.startsWith('http') || src.startsWith('https')) {
        return (
          <Image
            src={src}
            roundedCircle
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            alt="avatar"
          />
        );
      }

      // If src is text, return the first letter
      return (
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#ccc',
            textAlign: 'center',
            lineHeight: '50px',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#fff',
          }}
        >
          {src.charAt(0).toUpperCase()}
        </div>
      );
    }

    // If no src, show a default avatar image
    return (
      <Image
        src={defaultAvatar}
        roundedCircle
        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        alt="default-avatar"
      />
    );
  };

  return <>{getAvatarContent()}</>;
};

export default Avatar;


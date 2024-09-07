import React from 'react';
import Image from 'react-bootstrap/Image';
import defaultAvatar from '../../assets/images/defaultAvatar.jpeg';
import { Container } from 'react-bootstrap';

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
        <Container
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
          {src.charAt(0).match(/[a-z]/i) ? src.charAt(0).toUpperCase() : src.charAt(0)}
        </Container>
      );
    }

    // If no src, show a default avatar image
    return (
      <Image
        /* src={defaultAvatar} */
        src="https://i.pravatar.cc/200"
        roundedCircle
        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        alt="default-avatar"
      />
    );
  };

  return <>{getAvatarContent()}</>;
};

export default Avatar;


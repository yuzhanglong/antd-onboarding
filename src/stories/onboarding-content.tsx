import React from 'react';

interface OnBoardingContentProps {
  title: string;
  content: string;
}

const OnBoardingContent: React.FC<OnBoardingContentProps> = (props) => {
  const { title, content } = props;
  return (
    <div style={{
      width: 350
    }}>
      <div style={{
        fontWeight: 'bold',
        fontSize: 15,
        paddingBottom: 6
      }}>
        {title}
      </div>
      <div style={{
        fontSize: 14
      }}>
        {content}
      </div>
    </div>
  );
};

export default OnBoardingContent;

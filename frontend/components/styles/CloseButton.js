import styled from 'styled-components';

const CloseButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  font-size: 3rem;
  border: 0;
  position: absolute;
  z-index: 2;
  right: 0;
  top: 0;
  line-height: 1;
  padding: 1rem 1.5rem;
`;

export default CloseButton;

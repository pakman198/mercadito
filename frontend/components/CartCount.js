import React from 'react';
import styled from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group'

const Dot = styled.div`
  background: ${props => props.theme.primary};
  color: white;
  border-radius: 50%;
  padding: 0.5rem;
  line-height: 2rem;
  min-width: 3rem;
  margin-left: 1rem;
  font-weight: 100;
  /* 
    these 2 props make the container the same size 
    even though a 1 occupies less space than 5 
  */
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`;

const AnimationStyles = styled.span`
  position: relative;

  .count {
    display: block;
    position: relative;
    transition: all 0.4s;
    backface-visibility: hidden;
  }

  .count-enter {
    transform: rotateX(0.5turn);
  }

  .count-enter-active {
    transform: rotateX(0);
  }

  .count-exit {
    position: absolute;
    top: 0;
    transform: rotateX(0);
  }

  .count-exit-active {
    transform: rotateX(.5turn);
  }
`;

const CartCount = ({ count }) => {
  return (
    <AnimationStyles>
      <TransitionGroup>
        <CSSTransition
        unmountOnExit
          className="count" 
          classNames="count" 
          key={count} 
          timeout={{ enter: 400, exit: 400 }}
        >
          <Dot>
            { count }
          </Dot>
        </CSSTransition>
      </TransitionGroup>
    </AnimationStyles>
  );
}

export default CartCount;
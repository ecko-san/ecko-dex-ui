import React from 'react';
import styled, { css } from 'styled-components/macro';
import { useGameEditionContext } from '../../contexts';
import { commonTheme } from '../../styles/theme';
import GameEditionLabel from '../game-edition-v2/components/GameEditionLabel';

const STYText = styled.span`
  display: flex;
  align-items: center;
  cursor: ${({ onClick }) => onClick && 'pointer'};
  z-index: 1;
  color: ${({ withShade, theme: { colors }, color }) => (color ? color : withShade ? `${colors.white}99` : colors.white)};
  ${({ inverted, theme: { colors } }) =>
    inverted &&
    css`
      color: ${colors.primary};
    `}
  font-size: ${({ fontSize }) => fontSize}px;
  /* svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  } */

  &.capitalize {
    text-transform: capitalize;
  }

  &.uppercase {
    text-transform: uppercase;
  }

  &.justify-fe {
    justify-content: flex-end;
  }

  &.gradient {
    display: block;
    background-image: linear-gradient(90deg, #10c4df 0%, #f04ca9 51%, #edba31 100%);
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
  }
`;

const Label = ({
  className,
  children,
  fontFamily = 'basier',
  fontSize = 16,
  labelStyle,
  geFontSize,
  geFontWeight,
  geLabelStyle,
  geColor,
  color,
  inverted,
  withShade,
  geCenter,
  onClick,
  onClose,
  outGameEditionView,
}) => {
  const { gameEditionView } = useGameEditionContext();
  return gameEditionView && !outGameEditionView ? (
    <GameEditionLabel
      fontSize={geFontSize}
      fontWeight={geFontWeight}
      color={geColor}
      withShade={withShade}
      onClose={onClose}
      center={geCenter}
      style={geLabelStyle}
      onClick={onClick}
    >
      {children}
    </GameEditionLabel>
  ) : (
    <STYText
      className={`${fontFamily === 'syncopate' ? 'uppercase' : ''} ${className}`}
      inverted={inverted}
      color={color}
      fontSize={fontSize}
      onClick={onClick}
      withShade={withShade}
      style={{ fontFamily: commonTheme.fontFamily[fontFamily], ...labelStyle }}
    >
      {children}
    </STYText>
  );
};

export default Label;

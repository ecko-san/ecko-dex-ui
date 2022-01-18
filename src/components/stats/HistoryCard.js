import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { getDate, NETWORK_TYPE } from '../../constants/contextConstants';
import tokenData from '../../constants/cryptoCurrencies';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import useWindowSize from '../../hooks/useWindowSize';
import ColumnContent from '../../components/shared/ColumnContent';
import CustomLabel from '../../components/shared/CustomLabel';
import theme from '../../styles/theme';
import reduceToken from '../../utils/reduceToken';
import { Container } from '../layout/Containers';
import Label from '../../components/shared/Label';

const CustomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: 4px 0px;

  cursor: pointer;
`;

const HistoryCardContainer = styled(Container)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  flex-direction: ${({ gameEditionView }) => (!gameEditionView ? 'row' : 'column')};
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    & > *:not(:last-child) {
      margin-bottom: 16px;
    }
  }
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  img:first-child {
    z-index: 2;
  }
  img:not(:first-child):not(:last-child) {
    margin-left: -15px;
  }
`;

const MobileRowContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

const HistoryCard = ({ tx }) => {
  const { gameEditionView } = useContext(GameEditionContext);

  const getInfoCoin = (coinPositionArray) => {
    let cryptoCode = tx?.params[coinPositionArray]?.refName?.namespace
      ? `${tx?.params[coinPositionArray]?.refName?.namespace}.${tx?.params[coinPositionArray]?.refName?.name}`
      : tx?.params[coinPositionArray]?.refName?.name;
    const crypto = Object.values(tokenData).find(({ code }) => code === cryptoCode);
    return crypto;
  };

  const [width] = useWindowSize();

  return gameEditionView ? (
    <CustomGrid
      onClick={() => {
        window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${tx?.requestKey}`, '_blank', 'noopener,noreferrer');
      }}
    >
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'start', display: 'block' }}>
        Name
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'end', display: 'block', whiteSpace: 'nowrap' }}>{`${getInfoCoin(3)?.name}-${
        getInfoCoin(5)?.name
      }`}</Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'start', display: 'block' }}>
        Date
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'end', display: 'block', whiteSpace: 'nowrap' }}>{`${getDate(tx?.blockTime)}`}</Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'start', display: 'block' }}>
        Request Key
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'end', display: 'block', whiteSpace: 'nowrap' }}>
        {reduceToken(tx?.requestKey)}
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'start', display: 'block' }}>
        Amount
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'end', display: 'block', whiteSpace: 'nowrap' }}>{`${tx?.params[2]} ${
        getInfoCoin(3)?.name
      }`}</Label>
    </CustomGrid>
  ) : (
    <HistoryCardContainer
      gameEditionView={gameEditionView}
      onClick={() => {
        window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${tx?.requestKey}`, '_blank', 'noopener,noreferrer');
      }}
    >
      {/* ICONS */}
      {width >= theme.mediaQueries.mobilePixel ? (
        <>
          <IconsContainer style={{ flex: 1 }}>
            {getInfoCoin(3)?.icon}
            {getInfoCoin(5)?.icon}
            <CustomLabel bold>{`${getInfoCoin(3)?.name}-${getInfoCoin(5)?.name}`}</CustomLabel>
          </IconsContainer>
          <ColumnContent label="Date" value={`${getDate(tx?.blockTime)}`} />

          <ColumnContent label="Request Key" value={reduceToken(tx?.requestKey)} />

          <ColumnContent label="Amount" value={`${tx?.params[2]} ${getInfoCoin(3)?.name}`} containerStyle={{ flex: '0.5' }} />
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}>
          <MobileRowContainer>
            <IconsContainer style={{ flex: 1 }}>
              {getInfoCoin(3)?.icon}
              {getInfoCoin(5)?.icon}
              <CustomLabel bold>{`${getInfoCoin(3)?.name}-${getInfoCoin(5)?.name}`}</CustomLabel>
            </IconsContainer>
            <ColumnContent
              label="Request Key"
              value={reduceToken(tx?.requestKey)}
              containerStyle={{ flex: 'unset', width: 130 }}
              onClick={() => {
                window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${tx?.requestKey}`, '_blank', 'noopener,noreferrer');
              }}
            />
          </MobileRowContainer>

          <MobileRowContainer>
            <ColumnContent label="Date" value={`${getDate(tx?.blockTime)}`} />

            <ColumnContent label="Amount" value={`${tx?.params[2]} ${getInfoCoin(3)?.name}`} containerStyle={{ flex: 'unset', width: 130 }} />
          </MobileRowContainer>
        </div>
      )}
    </HistoryCardContainer>
  );
};

export default HistoryCard;

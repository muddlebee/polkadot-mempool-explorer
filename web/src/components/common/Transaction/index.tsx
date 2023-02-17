import React, { useState } from 'react'
import styled, { css } from 'styled-components'

import { ButtonCopy } from 'components/buttons/ButtonCopy'
import { ButtonExternalLink } from 'components/buttons/ButtonExternalLink'
import { CheckIcon } from 'components/icons/CheckIcon'
import { CopyIcon } from 'components/icons/CopyIcon'
import { ErrorIcon } from 'components/icons/ErrorIcon'
import { TimeIcon } from 'components/icons/TimeIcon'
import { TransferArrow } from 'components/icons/TransferArrow'
import { BaseCard } from 'components/pureStyledComponents/BaseCard'
import { Transaction as ExtrinsicModel } from 'contexts/ExplorerContext'
import useMempoolExplorer from 'hooks/useMempoolExplorer'
import Identicon from 'react-hooks-identicons'

import theme from '../../../theme/index'

interface StateType {
  isBlockDetailHidden: boolean
}

const Wrapper = styled(BaseCard)`
  margin: 0 0 10px;
  padding: 12px 15px;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }

  &.inMempool {
    border-left: 6px solid ${(props) => props.theme.colors.primary};
  }

  &.justRemoved {
    border-left: 6px solid ${(props) => props.theme.colors.mediumGrey};
  }
`

const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 4px;
  }
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  line-height: 1.2;
`

const TitleRow = styled(Row)`
  font-size: 15px;
`

const TitleRowBalance = styled(TitleRow)`
  margin-bottom: 10px;

  @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
    margin-bottom: 5px;
  }
`

const Label = styled.span`
  color: ${(props) => props.theme.colors.textColor};
  font-weight: 500;
  line-height: 1.2;
  margin-right: 6px;
  white-space: nowrap;
`

const VerticalLabel = styled.span`
  display: block;
  margin-bottom: -3px;
  margin-right: 0;
`

const ValueCSS = css`
  color: ${(props) => props.theme.colors.mediumGrey};
  line-height: 1.2;
  margin-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:last-child {
    margin-right: 0;
  }
`

const Value = styled.span`
  ${ValueCSS}
`

const LinkValue = styled.a`
  ${ValueCSS}
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const TimeWrapper = styled.div`
  align-items: center;
  display: flex;
  align-self: flex-end;

  margin-top: 11px;
`

const Time = styled.a`
  color: ${(props) => props.theme.colors.mediumGrey};
  font-size: 0.833em;
  font-weight: 400;
  line-height: 1.2;
  margin-left: 6px;
  margin-top: -1px;
  text-align: right;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: 17px;
  row-gap: 5px;

  @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
    column-gap: 20px;
    grid-auto-flow: column;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    row-gap: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`

const ButtonExternalLinkMini = styled(ButtonExternalLink)`
  height: 18px;
  width: 18px;

  svg {
    height: 7px;
    width: 7px;
  }
`

const BalanceTransferValue = styled(Value)`
  color: ${(props) => props.theme.colors.primary};
  font-weight: 500;
`

const BalanceTransfer = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  max-width: 100%;

  @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
    grid-template-columns: 1fr 50px 1fr;
    grid-template-rows: none;
  }
`

const TransferSubject = styled.div`
  column-gap: 8px;
  display: grid;
  grid-template-columns: 32px 1fr;
  max-width: 100%;
  min-width: 0;
`

const TransferIconWrapper = styled.div`
  display: none;
  align-items: center;
  justify-content: center;

  @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
    display: flex;
  }
`
const IdenticonCol = styled.div`
  padding-top: 5px;
`
const IdenticonWrapper = styled.div`
  grid-row: 1 / span 2;

  width: 98%;
  aspect-ratio: 1;

  border-radius: 50%;

  overflow: hidden;

  canvas {
    display: block;
  }
`

const TransferInfo = styled.div`
  min-width: 0;
`

const TransactionContainer = styled.div<StateType>`
  width: 100%;
  aspect-ratio: 1151 / 185;

  margin-bottom: 20px;

  padding-top: 0; //26px;
  padding-bottom: 0; //24px;
  padding-left: 0; //30px;
  padding-right: 0; //31px;

  position: relative;

  font-size: 12px;
  border-style: solid;
  border-width: 0;
  border-left-width: 6px;
  border-radius: 14px;
  border-color: ${(props) => props.theme.colors.primary};
  background-color: ${(props) => props.theme.cards.backgroundColor};

  &.inMempool {
    border-color: ${(props) => props.theme.colors.primary};
  }

  &.justRemoved {
    border-color: ${(props) => props.theme.colors.mediumGrey};
  }

  @media (max-width: ${(props) => props.theme.themeBreakPoints.xl}) {
    font-size: 10px;
  }

  @media (max-width: ${(props) => props.theme.themeBreakPoints.lg}) {
    font-size: 8px;
  }

  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    aspect-ratio: ${(props) =>
      props.isBlockDetailHidden ? '292 / 165' : '292 / 255'}; //292 / 255;

    font-size: 6px;
  }
`
const ContentWrapper = styled.div`
  display: grid;

  /* grid-template-rows: 29.57% 1fr; */
  grid-template-rows: 1fr 61.26%;
  grid-template-columns: 65.504% 1fr;
  /* grid-template-columns: 0.655fr 0.3082fr; */

  column-gap: 3.475%;
  row-gap: 6.25%;

  width: 94.7%;
  height: 73.43%;
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */

  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    grid-template-columns: 100%;
    grid-template-rows: auto;

    row-gap: 4px;
  }
`

const TxHashContainer = styled.div`
  display: flex;
  align-items: center;
  grid-column: 1;

  padding-left: 14px;

  border-radius: 5px;

  background-color: ${(props) => props.theme.cards.textContainerBackgroundColor};

  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    grid-row: 3;
    grid-column: 1 / span 1;
  }
`

const TxHashLabel = styled.div`
  width: 8.123%;
  color: ${(props) => props.theme.colors.lightBlack};
  font-weight: 700;
  //font-size: 12px;
`
const TxHash = styled.div`
  width: 81.36%;
  margin-left: 4px;
  color: ${(props) => props.theme.colors.infoTextColor};
  font-weight: 400;
  //font-size: 12px;
`

const BalanceTransferContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: 2;

  border-radius: 5px;

  background-color: ${(props) => props.theme.cards.textContainerBackgroundColor};

  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    grid-row: 1;
    grid-column: 1 / span 1;

    aspect-ratio: 274 / 30;
  }
`
const BalanceTransferLabel = styled.div`
  width: 36.65%;
  color: ${(props) => props.theme.colors.lightBlack};
  font-weight: 700;
`
const BalanceTransferAmount = styled.div`
  width: 25%;
  margin-left: 4px;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 700;
`
const DetailsToggleBtn = styled.div`
  display: none;
  width: 100%;
  height: 15px;

  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    display: block;
  }
`

const AdditionalInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  grid-row: 2;
  grid-column: 1;

  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    flex-direction: column-reverse;
    grid-row: 4;
    height: fit-content;
  }
`

const HorizontalStripContainer = styled.div<StateType>`
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  column-gap: 1.67%;

  height: 67.045%;

  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    display: ${(props) => (props.isBlockDetailHidden ? 'none' : 'grid')};
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    column-gap: 4px;
    row-gap: 5px;
  }
`

const HorizontalStrip = styled.div`
  height: 100%;
  aspect-ratio: 168.35 / 59;
  max-width: 100%;

  padding-top: 0; //13px;
  padding-left: 0; //16px;

  border-radius: 5px;
  background-color: ${(props) => props.theme.cards.textContainerBackgroundColor};
`
const HorizontalStripLabel = styled.div`
  color: ${(props) => props.theme.cards.mediumBlack};
  font-weight: 600;
`
const HorizontalStripText = styled.div`
  color: ${(props) => props.theme.colors.infoTextColor};
  font-weight: 400;
`
const MiniCardContainer = styled.div`
  position: relative;
  display: grid;

  grid-template-columns: 1fr 1fr;
  column-gap: 2.67%;

  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    grid-row: 2;
    column-gap: 4px;
  }
`
const TransferArrowContainer = styled.div`
  position: absolute;

  width: 7.121%;

  top: 14.77%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;

  background-color: #fff;
  border-radius: 50%;
`

const MiniCard = styled.div`
  padding-top: 7px;
  padding-bottom: 9px;
  padding-left: 5px;
  padding-right: 5px;

  border-radius: 5px;
  background-color: ${(props) => props.theme.cards.textContainerBackgroundColor};
`
const CopyAndExternalLinkContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  margin-top: 7px;
`
const ProfileContainer = styled.div`
  display: grid;
  grid-template-rows: 50% 50%;
  grid-template-columns: 27.27% 1fr;
  column-gap: 4%;

  width: 100%;
  height: 53.4%;
`
const UserDP = styled.div`
  grid-row: 1 / span 2;
  width: 100%;
  aspect-ratio: 1;

  border-radius: 50%;
  overflow: hidden;
`
const UserDesignationLabel = styled.div`
  grid-row: 1;
  grid-column: 2;
  font-weight: 600;
  font-size: 1em;
  color: #000;
`
const UserUID = styled.div`
  grid-row: 2;
  grid-column: 2;

  width: 100%;
  height: 100%;
  overflow: hidden;
`

interface Props {
  data: ExtrinsicModel
}

export const Transaction: React.FC<Props> = (props) => {
  const [state, setState] = useState<StateType>({ isBlockDetailHidden: false })
  const { data, ...restProps } = props
  const {
    balance_transfer: balanceTransfer,
    block_number: blockNumber,
    from,
    hash,
    isFinalized,
    isValid,
    nonce,
    to,
    type,
    update_at: updateAt,
  } = data
  const { selectedNetwork } = useMempoolExplorer()
  const result = isValid ? 'Valid' : 'Invalid'
  const explorerURL = `https://${selectedNetwork.id}.subscan.io/`
  const blockURL = `${explorerURL}block/`
  const extrinsicURL = `${explorerURL}extrinsic/`
  const accountURL = `${explorerURL}account/`

  let senderBrokenUid = ''
  let receiverBrokenUid = ''
  for (let i = 0; i < 11; i++) {
    senderBrokenUid += from[i]
  }
  senderBrokenUid += '...'

  if (!(to === undefined || to === null || to === '')) {
    for (let i = 0; i < 11; i++) {
      receiverBrokenUid += to[i]
    }
    receiverBrokenUid += '...'
  }

  // console.log('receiver broken uid')
  // console.log(receiverBrokenUid)

  const onDetailToggleBtnClicked = () => {
    console.log('CLicked it')
    if (state.isBlockDetailHidden) {
      setState({
        ...state,
        isBlockDetailHidden: false,
      })
      return
    }

    setState({
      ...state,
      isBlockDetailHidden: true,
    })
  }

  return (
    <TransactionContainer
      className={isFinalized ? 'justRemoved' : 'inMempool'}
      isBlockDetailHidden={state.isBlockDetailHidden}
    >
      <ContentWrapper>
        <TxHashContainer>
          <TxHashLabel>Tx Hash:</TxHashLabel> <TxHash>{hash}</TxHash>
          <ButtonCopy value={hash} />
          <ButtonExternalLink
            href={`${extrinsicURL}${hash}`}
            style={{
              marginLeft: '5px',
              marginRight: '14px',
            }}
          />
        </TxHashContainer>

        {type !== 'Inherent' && (
          <BalanceTransferContainer>
            <BalanceTransferLabel>Balance Transfer:</BalanceTransferLabel>
            <BalanceTransferAmount>{balanceTransfer}</BalanceTransferAmount>
          </BalanceTransferContainer>
        )}

        <AdditionalInfoContainer>
          <HorizontalStripContainer isBlockDetailHidden={state.isBlockDetailHidden}>
            <HorizontalStrip>
              <HorizontalStripLabel>Block Number:</HorizontalStripLabel>
              <HorizontalStripText>{'#' + blockNumber}</HorizontalStripText>
            </HorizontalStrip>
            <HorizontalStrip>
              <HorizontalStripLabel>Nonce:</HorizontalStripLabel>
              <HorizontalStripText>{'#' + nonce}</HorizontalStripText>
            </HorizontalStrip>
            <HorizontalStrip>
              <HorizontalStripLabel>Extrinsic Type</HorizontalStripLabel>
              <HorizontalStripText>{type}</HorizontalStripText>
            </HorizontalStrip>
            <HorizontalStrip>
              <HorizontalStripLabel>Result Type</HorizontalStripLabel>
              <HorizontalStripText>{result}</HorizontalStripText>
            </HorizontalStrip>
          </HorizontalStripContainer>

          <TimeWrapper>
            <TimeIcon />
            <Time href={`${extrinsicURL}${hash}`} target="_blank">
              {updateAt}
            </Time>
          </TimeWrapper>
        </AdditionalInfoContainer>

        {type !== 'Inherent' && (
          <MiniCardContainer>
            <MiniCard>
              <ProfileContainer>
                <UserDP>{<Identicon bg="#000000" count="5" size="70" string={from} />}</UserDP>
                <UserDesignationLabel>From</UserDesignationLabel>
                <UserUID>{senderBrokenUid}</UserUID>
              </ProfileContainer>

              <CopyAndExternalLinkContainer>
                <ButtonCopy value={from} />
                <ButtonExternalLink
                  href={`${accountURL}${from}`}
                  style={{
                    marginLeft: '5px',
                    marginRight: '0px',
                  }}
                />
              </CopyAndExternalLinkContainer>
            </MiniCard>

            <MiniCard>
              <ProfileContainer>
                <UserDP>{<Identicon bg="#000000" count="5" size="70" string={to} />}</UserDP>
                <UserDesignationLabel>To</UserDesignationLabel>
                <UserUID>{receiverBrokenUid}</UserUID>
              </ProfileContainer>

              <CopyAndExternalLinkContainer>
                <ButtonCopy value={to} />
                <ButtonExternalLink
                  href={`${accountURL}${to}`}
                  style={{
                    marginLeft: '5px',
                    marginRight: '0px',
                  }}
                />
              </CopyAndExternalLinkContainer>
            </MiniCard>

            <TransferArrowContainer>
              <TransferArrow
                style={{
                  position: 'relative',
                  width: '65%',

                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, 0%)',
                }}
              />
            </TransferArrowContainer>
          </MiniCardContainer>
        )}

        <DetailsToggleBtn onClick={onDetailToggleBtnClicked}>Details</DetailsToggleBtn>
      </ContentWrapper>
    </TransactionContainer>
  )

  return (
    <Wrapper {...restProps} className={isFinalized ? 'justRemoved' : 'inMempool'}>
      <TopWrapper>
        <TitleRow>
          <Label>Tx Hash:</Label>
          <LinkValue href={`${extrinsicURL}${hash}`} target="_blank">
            {hash}
          </LinkValue>
          <ButtonCopy value={hash} />
          <ButtonExternalLink href={`${extrinsicURL}${hash}`} style={{ marginLeft: '2px' }} />
        </TitleRow>
        <TimeWrapper>
          <TimeIcon />
          <Time href={`${extrinsicURL}${hash}`} target="_blank">
            {updateAt}
          </Time>
        </TimeWrapper>
      </TopWrapper>
      <ValuesGrid>
        {blockNumber !== '' && (
          <Row>
            <Label>Block Number:</Label>
            <LinkValue href={`${blockURL}${blockNumber}`} target="_blank">
              #{blockNumber}
            </LinkValue>
            <ButtonExternalLinkMini href={`${blockURL}${blockNumber}`} />
          </Row>
        )}
        <Row>
          <Label>Nonce:</Label>
          <Value>{nonce}</Value>
        </Row>
        <Row>
          <Label>Extrinsic Type:</Label>
          <Value>{type}</Value>
        </Row>
        <Row>
          <Label>Result:</Label>
          <Value style={{ textTransform: 'capitalize' }}>{result}</Value>
          {isValid ? <CheckIcon /> : <ErrorIcon />}
        </Row>
      </ValuesGrid>
      {balanceTransfer && from && to && (
        <>
          <TitleRowBalance>
            <Label>Balance Transfer</Label>
            <BalanceTransferValue>({balanceTransfer})</BalanceTransferValue>
          </TitleRowBalance>
          <BalanceTransfer>
            <TransferSubject>
              <IdenticonCol>
                <IdenticonWrapper>
                  {<Identicon bg="#f0f1f2" count="5" size="33" string={from} />}
                </IdenticonWrapper>
              </IdenticonCol>
              <TransferInfo>
                <VerticalLabel>From</VerticalLabel>
                <Row>
                  <LinkValue href={`${accountURL}${from}`} target="_blank">
                    {from}
                  </LinkValue>
                  <ButtonCopy value={from} />
                  <ButtonExternalLink href={`${accountURL}${from}`} style={{ marginLeft: '2px' }} />
                </Row>
              </TransferInfo>
            </TransferSubject>
            <TransferIconWrapper>
              <TransferArrow />
            </TransferIconWrapper>
            <TransferSubject>
              <IdenticonCol>
                <IdenticonWrapper>
                  {<Identicon bg="#f0f1f2" count="5" size="33" string={to} />}
                </IdenticonWrapper>
              </IdenticonCol>
              <TransferInfo>
                <VerticalLabel>To</VerticalLabel>
                <Row>
                  <LinkValue href={`${accountURL}${to}`} target="_blank">
                    {to}
                  </LinkValue>
                  <ButtonCopy value={to} />
                  <ButtonExternalLink href={`${accountURL}${to}`} style={{ marginLeft: '2px' }} />
                </Row>
              </TransferInfo>
            </TransferSubject>
          </BalanceTransfer>
        </>
      )}
    </Wrapper>
  )
}

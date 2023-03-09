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
import DownArrow from '../../icons/DownArrow.svg'
import UpArrow from '../../icons/UpArrow.svg'

interface PropType {
  state: StateType
}

interface StateType {
  isBlockDetailHidden: boolean
  isTransactionDetailHidden: boolean
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

  margin-top: 20px;

  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    margin-top: 0px;
  }
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

const TransactionContainer = styled.div<PropType>`
  width: ${(props) => (props.state.isTransactionDetailHidden ? '63.5%' : '100%')}; //100%;
  aspect-ratio: ${(props) =>
    props.state.isTransactionDetailHidden ? '733 / 149' : '1147 / 149'}; //1147 / 149;//1151 / 185;

  margin-bottom: 20px;

  padding-top: 0; //26px;
  padding-bottom: 0; //24px;
  padding-left: 0; //30px;
  padding-right: 0; //31px;

  position: relative;

  font-size: 12px;
  box-shadow: 2px 2px 1px rgba(0, 0, 0, 0.1);
  border-style: solid;
  border-width: 0.1px;
  border-left-width: 6px;
  border-radius: 5px;
  border-color: ${(props) => props.theme.colors.primary};
  background-color: ${(props) => props.theme.cards.backgroundColor};

  &.inMempool {
    border-color: ${(props) => props.theme.colors.primary};
  }

  &.justRemoved {
    border-color: ${(props) => props.theme.colors.mediumGrey};
  }

  @media (min-width: ${(props) => props.theme.themeBreakPoints.superLarge}) {
    font-size: 14px;
  }

  @media (max-width: ${(props) => props.theme.themeBreakPoints.xxl}) {
    font-size: 11px;
  }

  @media (max-width: ${(props) => props.theme.themeBreakPoints.xl}) {
    font-size: 10px;
  }

  @media (max-width: ${(props) => props.theme.themeBreakPoints.lg}) {
    font-size: 8px;
  }

  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    width: 100%;
    aspect-ratio: ${(props) => {
      if (props.state.isBlockDetailHidden && props.state.isTransactionDetailHidden) {
        return '292 / 84'
      }
      if (props.state.isBlockDetailHidden && !props.state.isTransactionDetailHidden) {
        return '292 / 212'
      }
      if (!props.state.isBlockDetailHidden && props.state.isTransactionDetailHidden) {
        return '292 / 175'
      }
      return '292 / 299'
    }};
    /* aspect-ratio: ${(props) => (props.state.isBlockDetailHidden ? '292 / 165' : '292 / 255')}; */

    font-size: 12px;
  }
`
const ContentWrapper = styled.div<PropType>`
  display: grid;

  /* grid-template-rows: 29.57% 1fr; */
  grid-template-rows: 1fr 61.26%;
  grid-template-columns: ${(props) =>
    props.state.isTransactionDetailHidden ? '1fr' : '62.364% 1fr'}; //62.364% 1fr;//65.504% 1fr;
  /* grid-template-columns: 0.655fr 0.3082fr; */

  column-gap: 3.475%;
  row-gap: 6.25%;

  width: 94.7%;
  height: 73.43%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    grid-template-columns: 100%;
    grid-template-rows: auto;

    row-gap: 0px;

    height: 95.205%;
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

    aspect-ratio: 281 / 31;
  }
`

const TxHashLabel = styled.div`
  flex-shrink: 0;
  width: fit-content;
  color: ${(props) => props.theme.colors.lightBlack};
  font-weight: 700;
  //font-size: 12px;
  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    width: 17.79%;
  }
`
const TxHash = styled.div`
  width: 81.36%;
  margin-left: 4px;
  color: ${(props) => props.theme.colors.infoTextColor};
  font-weight: 400;
  //font-size: 12px;
  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    width: 60.49%;
  }
`

const BalanceTransferContainer = styled.div<PropType>`
  display: ${(props) => (props.state.isTransactionDetailHidden ? 'none' : 'flex')}; //flex;
  justify-content: flex-start;
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
  margin-left: 2.58%;
  width: fit-content;

  color: ${(props) => props.theme.colors.lightBlack};
  font-weight: 700;
`
const BalanceTransferAmount = styled.div`
  width: fit-content;
  margin-left: 1.033%;

  color: ${(props) => props.theme.colors.primary};
  font-weight: 700;
`
const DetailsToggleBtn = styled.div`
  position: relative;
  display: none;
  width: 100%;
  aspect-ratio: 100 / 10;

  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    display: block;
    grid-row: 5;
  }
`
const ShowDetails = styled.div`
  position: absolute;

  left: 50%;
  transform: translateX(-50%);
`
const HideDetails = styled.div`
  position: absolute;

  left: 50%;
  transform: translateX(-50%);
`

const AdditionalInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  grid-row: 2;
  grid-column: 1;

  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    flex-direction: column-reverse;
    justify-content: space-between;
    grid-row: 4;

    width: 100%;
    height: fit-content;
  }
`

const HorizontalStripContainer = styled.div<PropType>`
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  column-gap: 1.67%;

  height: 67.045%;

  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    display: ${(props) => (props.state.isBlockDetailHidden ? 'none' : 'grid')};
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    column-gap: 4px;
    row-gap: 5px;

    margin-top: 8px;
  }
`

const HorizontalStrip = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1%;
  justify-content: center;
  height: 100%;
  aspect-ratio: 168.35 / 59;
  max-width: 100%;

  padding-top: 0; //13px;
  padding-left: 0; //16px;

  border-radius: 5px;
  background-color: ${(props) => props.theme.cards.textContainerBackgroundColor};
`
const HorizontalStripLabel = styled.div`
  /* margin-top: 9%; */
  margin-left: 16px;

  color: ${(props) => props.theme.cards.mediumBlack};
  font-weight: 400;
`
const HorizontalStripText = styled.div`
  // margin-bottom: 9%;
  margin-left: 16px;

  color: ${(props) => props.theme.colors.infoTextColor};
  font-weight: 600;
`
const MiniCardContainer = styled.div<PropType>`
  position: relative;
  display: ${(props) => (props.state.isTransactionDetailHidden ? 'none' : 'grid')}; //grid;

  grid-template-columns: 1fr 1fr;
  column-gap: 2.67%;

  @media (max-width: ${(props) => props.theme.themeBreakPoints.sm}) {
    grid-row: 2;
    column-gap: 4px;

    aspect-ratio: 273 / 40;
  }
`
const TransferArrowContainer = styled.div`
  position: absolute;

  width: 11.121%;

  top: 47.77%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;

  background-color: rgba(255, 255, 255, 0);
  border-radius: 50%;
`

const MiniCard = styled.div`
  position: relative;
  height: 86%;
  /* padding-top: 7px;
  padding-bottom: 9px;
  padding-left: 5px;
  padding-right: 5px; */

  border-radius: 5px;
  background-color: ${(props) => props.theme.cards.textContainerBackgroundColor};
`
const CopyAndExternalLinkContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  margin-top: -20px;
`
const ProfileContainer = styled.div`
  position: absolute;
  display: grid;
  grid-template-rows: 50% 50%;
  grid-template-columns: 27.27% 1fr;
  column-gap: 4%;

  width: 91.57%;
  height: 66.66%; //53.4%;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
const UserDP = styled.div`
  grid-row: 1 / span 2;
  //width: 100%;
  height: 100%;
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
  const [state, setState] = useState<StateType>({
    isBlockDetailHidden: false,
    isTransactionDetailHidden: type === 'Inherent',
  })
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
    for (let i = 0; i < 10; i++) {
      receiverBrokenUid += to[i]
    }
    receiverBrokenUid += '...'
  }

  let brokenTxHash = ''
  for (let i = 0; i < 11; i++) {
    brokenTxHash += hash[i]
  }
  brokenTxHash += '...'
  const txHashToBeDisplayed =
    window.screen.width <= parseInt(theme.themeBreakPoints.sm) ? brokenTxHash : hash

  // console.log('receiver broken uid')
  // console.log(receiverBrokenUid)
  console.log('type = ' + type)
  console.log(type === 'Inherent')

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
    <TransactionContainer className={isFinalized ? 'justRemoved' : 'inMempool'} state={state}>
      <ContentWrapper state={state}>
        <TxHashContainer>
          <TxHashLabel>Tx Hash:</TxHashLabel> <TxHash>{txHashToBeDisplayed}</TxHash>
          <ButtonCopy value={hash} />
          <ButtonExternalLink
            href={`${extrinsicURL}${hash}`}
            style={{
              marginLeft: '5px',
              marginRight: '14px',
            }}
          />
        </TxHashContainer>

        <BalanceTransferContainer state={state}>
          <BalanceTransferLabel>Balance Transfer:</BalanceTransferLabel>
          <BalanceTransferAmount>{balanceTransfer}</BalanceTransferAmount>
        </BalanceTransferContainer>

        <AdditionalInfoContainer>
          <HorizontalStripContainer state={state}>
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

        <MiniCardContainer state={state}>
          <MiniCard>
            <ProfileContainer>
              <UserDP>{<Identicon bg="#000000" count="5" size="70" string={from} />}</UserDP>
              <UserDesignationLabel>
                From
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
              </UserDesignationLabel>
              <UserUID>{senderBrokenUid}</UserUID>
            </ProfileContainer>

            {/* <CopyAndExternalLinkContainer>
              <ButtonCopy value={from} />
              <ButtonExternalLink
                href={`${accountURL}${from}`}
                style={{
                  marginLeft: '5px',
                  marginRight: '0px',
                }}
              />
            </CopyAndExternalLinkContainer> */}
          </MiniCard>

          <MiniCard>
            <ProfileContainer>
              <UserDP>{<Identicon bg="#000000" count="5" size="70" string={to} />}</UserDP>
              <UserDesignationLabel>
                To
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
              </UserDesignationLabel>
              <UserUID>{receiverBrokenUid}</UserUID>
            </ProfileContainer>

            {/* <CopyAndExternalLinkContainer>
              <ButtonCopy value={to} />
              <ButtonExternalLink
                href={`${accountURL}${to}`}
                style={{
                  marginLeft: '5px',
                  marginRight: '0px',
                }}
              />
            </CopyAndExternalLinkContainer> */}
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

        <DetailsToggleBtn onClick={onDetailToggleBtnClicked}>
          {state.isBlockDetailHidden && (
            <ShowDetails>
              More Details <img alt="I" src={DownArrow} />
            </ShowDetails>
          )}
          {!state.isBlockDetailHidden && (
            <HideDetails>
              <img alt="I" src={UpArrow} />
            </HideDetails>
          )}
        </DetailsToggleBtn>
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

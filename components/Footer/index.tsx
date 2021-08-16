import { Footer, TelegramIcon, TwitterIcon, HoverContainer, Link } from './style';

const footer = () => {
  return (
  <Footer>
    <HoverContainer>
      <Link target="_blank" href="https://twitter.com/tefiapp?lang=en">
        <TwitterIcon />
      </Link>
    </HoverContainer>
    <HoverContainer>
      <Link target="_blank" href="https://t.co/1EpMGxZKe5?amp=1">
        <TelegramIcon />
      </Link>
    </HoverContainer>
  </Footer>
  )
};

export default footer;

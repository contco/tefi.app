import { Wrapper, TelegramIcon, TwitterIcon, HoverContainer, Link } from './style';

const data = [
  {
    component: <TelegramIcon />,
    uri: 'https://t.co/1EpMGxZKe5?amp=1',
  },
  {
    component: <TwitterIcon />,
    uri: 'https://twitter.com/tefiapp',
  },
];

const Footer = () => {
  return (
    <Wrapper>
      {data.map((item, index) => (
        <HoverContainer key={index}>
          <Link target="_blank" href={item.uri}>
            {item.component}
          </Link>
        </HoverContainer>
      ))}
    </Wrapper>
  );
};

export default Footer;

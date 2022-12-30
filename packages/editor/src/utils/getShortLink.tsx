const getShortLink = (l: string) => {
  const link = l;
  if (link && link.length > 48) {
    return `${link.slice(0, 44)}...`;
  }
  return link;
};

export default getShortLink;

const ghpages = require('gh-pages');

ghpages.publish('docs', {
  branch: "main",
  repo: "https://github.com/contco/terra-utilities.git"
}, (err: any) => {
  if(err) {
  console.log(err)
  }
  else {
    console.log("Successfully Deployed");
  }
});
import React from 'react';
import { Page, Navbar, Link, Block, BlockTitle } from 'framework7-react';

export default () => (
  <Page>
    <Navbar title="About" backLink="Back"></Navbar>
    <BlockTitle>About My App</BlockTitle>
    <Block strong>
      <p>Here is About page!</p>
      <h1>Have Fun & Get Posting!</h1>
      <p>Sezzwho helps you recommend the products and services you love with authentic videos. Just tried a new restaurant, got a cool gift, or had a really good customer experience? Your review could start a trend or get a great business noticed. You might even discover something totally new!  </p>
    </Block>
  </Page>
);

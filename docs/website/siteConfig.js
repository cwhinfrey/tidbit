/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const siteConfig = {
  title: 'Tidbit',
  tagline: 'A library for oracles on Ethereum.',
  url: 'https://tidbit.org',
  baseUrl: '/',
  organizationName: 'levelkdev',
  projectName: 'tidbit',
  headerLinks: [
    {
      doc: 'IOracle',
      label: 'API',
    },
    {
      href: 'https://github.com/levelkdev/tidbit',
      label: 'Github',
    },
  ],
  //headerIcon: 'img/image.png',
  //footerIcon: 'img/image.png',
  //favicon: 'img/favicon.png',
  colors: {
    primaryColor: '#1d2d3c',
    secondaryColor: 'white',
  },
  copyright: 'Copyright © 2018 Level K, Inc.',
  highlight: {
    theme: 'default',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  stylesheets: [
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://fonts.googleapis.com/css?family=Lato:100,200,300,400,500,700,400italic,700italic',
  ],
  repoUrl: 'https://github.com/levelkdev/tidbit',
};

module.exports = siteConfig;

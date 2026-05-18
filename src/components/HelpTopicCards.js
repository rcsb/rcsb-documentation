import React from 'react';
import './HelpTopicCards.css';

const ICON_BASE = 'https://cdn.rcsb.org/rcsb-pdb/v2/common/images/';

const helpCards = [
  {
    title: 'Attribute-based Searching and Browsing',
    icon: 'text-search.png',
    content: (
      <>
        <a href="/docs/search-and-browse/advanced-search/attribute-details">Attributes</a> can be used to search for{' '}
        <a href="/docs/search-and-browse/advanced-search/attribute-search">proteins</a> or{' '}
        <a href="/docs/search-and-browse/advanced-search/attribute-search#types-of-chemical-attributes">ligands</a>. A subset of
        attributes can be used to <a href="/docs/search-and-browse/browse-options/overview-browse">browse</a> the PDB.
      </>
    )
  },
  {
    title: 'Data offered on RCSB.org',
    icon: 'data.png',
    content: (
      <>
        Learn about <a href="/docs/general-help/organization-of-3d-structures-in-the-protein-data-bank">experimental</a> and{' '}
        <a href="/docs/general-help/integrative-structures-on-rcsborg">integrative</a> PDB structures as well as{' '}
        <a href="/docs/general-help/computed-structure-models-and-rcsborg">Computed Structure Models (CSMs)</a>. Access list of
        integrated <a href="/docs/general-help/data-from-external-resources-integrated-into-rcsb-pdb">external resources</a>.
      </>
    )
  },
  {
    title: 'Help Resources for Depositors',
    icon: 'deposit.png',
    content: (
      <>
        <a href="https://www.wwpdb.org/deposition/deposition-resources" target="_blank" rel="noopener noreferrer">Overview</a> of the
        wwPDB data deposition resources on the worldwide PDB (wwPDB) website.
      </>
    )
  },
  {
    title: 'Advanced Search Tools',
    icon: 'other-searches.png',
    content: (
      <>
        Proteins can be found by similarity in{' '}
        <a href="/docs/search-and-browse/advanced-search/3d-similarity-search">3D structure</a> or{' '}
        <a href="/docs/search-and-browse/advanced-search/sequence-similarity-search">sequence</a>, as well as{' '}
        <a href="/docs/search-and-browse/advanced-search/sequence-motif-search">sequence</a> or{' '}
        <a href="/docs/search-and-browse/advanced-search/3d-motif-search">structure</a> motif. Ligands can be searched for by{' '}
        <a href="/docs/search-and-browse/advanced-search/chemical-similarity-search">similarity</a>.
      </>
    )
  },
  {
    title: 'Organization of information on RCSB.org',
    icon: 'cogs.png',
    content: (
      <>
        Find out what info is found on the <a href="/docs/exploring-a-3d-structure/overview">summary pages</a> for each structure.
        Learn how to explore <a href="/docs/grouping-structures/overview-grouping-structures">groups of similar structures</a>.
      </>
    )
  },
  {
    title: 'Video Guides and Training Resources',
    icon: 'video.png',
    content: (
      <>
        Learn about the 3D data and RCSB.org tools by watching{' '}
        <a href="/help/videos#structural-biology-data">video tutorials</a>,{' '}
        <a href="https://pdb101.rcsb.org/train/training-events" target="_blank" rel="noopener noreferrer">recorded webinars</a> and{' '}
        <a href="https://www.youtube.com/playlist?list=PLHib7JgKNUUeM89w-95FLlt1a0haO8WMR" target="_blank" rel="noopener noreferrer">office
          hours</a>.
      </>
    )
  },
  {
    title: '3D Visualization Tools',
    icon: '3d-viz.png',
    content: (
      <>
        Master Mol* using <a href="/docs/3d-viewers/mol*/getting-started">help articles</a> and{' '}
        <a href="/help/videos#molecular-visualization">video guides</a>. Learn how to visualize{' '}
        <a href="/docs/3d-viewers/mol*/faqs-scenarios#how-to-display-the-interactions-of-a-ligand-with-amino-acids-and-ligands-bound-nearby--from-the-structure-summary-page">ligand
          interactions</a>, and <a href="/docs/tools/pairwise-structure-alignment">pairwise structure alignment</a>.
      </>
    )
  },
  {
    title: 'Data Quality Assessment',
    icon: 'validation.png',
    content: (
      <>
        Learn about resources to assess and visualize in 3D the quality of{' '}
        <a href="/docs/general-help/assessing-the-quality-of-3d-structures">structures</a> and{' '}
        <a href="/docs/general-help/ligand-structure-quality-in-pdb-structures">ligands</a>.
      </>
    )
  },
  {
    title: 'FAQs and Glossary',
    icon: 'qanda.png',
    content: (
      <>
        <a href="/docs/general-help/website-faq">Browse top user questions</a> organized by topic. The{' '}
        <a href="/docs/general-help/glossary">Glossary</a> for commonly used terms is also provided.
      </>
    )
  },
  {
    title: 'Sequence Analysis Tools',
    icon: 'sequence.png',
    content: (
      <>
        Learn how to analyze sequence <a href="/docs/sequence-viewers/sequence-annotations-viewer">annotations</a> and{' '}
        <a href="/docs/sequence-viewers/protein-sequence-alignment-view">alignment</a>, and to explore sequences in the{' '}
        <a href="/docs/sequence-viewers/genome-view">context of the genome</a>.
      </>
    )
  },
  {
    title: 'APIs and Programmatic Access',
    icon: 'data-access.png',
    content: (
      <>
        Learn about RCSB PDB <a href="/docs/programmatic-access/web-apis-overview">Web APIs</a> and how to{' '}
        <a href="/docs/programmatic-access/file-download-services">batch download</a> the data.
      </>
    )
  },
  {
    title: 'Learning and training on PDB-101',
    icon: 'pdb101.png',
    content: (
      <>
        <a href="https://pdb101.rcsb.org/" target="_blank" rel="noopener noreferrer">PDB-101</a> is the training and outreach portal
        of the RCSB PDB. Explore the{' '}
        <a href="https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/introduction" target="_blank" rel="noopener noreferrer">Guide
          to PDB Data</a> and{' '}
        <a href="https://pdb101.rcsb.org/train/training-events" target="_blank" rel="noopener noreferrer">training materials</a>.
      </>
    )
  }
];

const HelpTopicCards = () => {
  return (
    <div className="help-topic-grid row gx-3 gy-3 mb-4">
      {helpCards.map((card) => (
        <div key={card.title} className="col-lg-4 col-md-6 col-sm-12 d-flex">
          <article className="help-topic-card w-100">
            <div className="help-topic-card__text">
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </div>
            <img
              src={`${ICON_BASE}${card.icon}`}
              className="help-topic-card__icon"
              alt={`${card.title} icon`}
              loading="lazy"
            />
          </article>
        </div>
      ))}
    </div>
  );
};

export default HelpTopicCards;

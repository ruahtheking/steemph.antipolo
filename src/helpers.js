const helpers = {};

const $ = require('jquery');
const moment = require('moment');

helpers.randomNumberBetween = (min, max) => {
  return min + Math.random() * (max - min);
};

helpers.renderFaq = (categoryId, categoryName, faq) => {
  let template = `
<div class="card">
    <div class="card-header">
        <h5 class="mb-0">
            <a href="#collapse${categoryId}" class="btn btn-link" data-toggle="collapse">
                ${categoryName}
            </a>
        </h5>
    </div>

    <div id="collapse${categoryId}" class="collapse" data-parent="#faq-accordion">
        <div class="card-body">
          <div id="faq-accordion-${categoryId}"></div>
        </div>
    </div>
</div>
`;

  $('#faq-accordion').append(template);
  helpers.renderFaqQuestions(categoryId, faq[categoryId]);
};

helpers.renderFaqQuestions = (categoryId, questions) => {
  for (let i = 0; i < questions.length; i++) {
    let template = `
<div class="card">
    <div class="card-header">
        <h5 class="mb-0">
            <a href="#collapse${questions[i].hash}" class="btn btn-link" data-toggle="collapse">
                ${questions[i].title}
            </a>
        </h5>
    </div>

    <div id="collapse${ questions[i].hash }" class="collapse" data-parent="#faq-accordion-${categoryId}">
        <div class="card-body">
          ${questions[i].html}
        </div>
    </div>
</div>
`;

    $('#faq-accordion-' + categoryId).append(template);
  }
};

helpers.getProjects = () => {
  return new Promise(function(resolve, reject) {
    $.get('projects.json', (projects) => {
      resolve(projects);
    });
  })
};

helpers.getContributionsByGitHubId = (gitHubId) => {
  return new Promise((resolve, reject) => {
      $.get('https://api.utopian.io/api/posts/?limit=10&section=project&sortBy=votes&platform=github&projectId=' + gitHubId, (contributions) => {
        resolve(contributions.results);
      });
  });
};

helpers.getContributionHtml = (contribution) => {
  let categoryLabel = '',
    icon = '';
  switch (contribution.json_metadata.type) {
    case 'ideas':
    case 'task-ideas':
      categoryLabel = 'Suggestion';
      icon = `<svg viewBox="0 0 24 24">
                  <path d="M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z" />
              </svg>`;
      break;
    case 'blog':
      categoryLabel = 'Blog Post';
      icon = `<svg viewBox="0 0 24 24">
                  <path d="M15,7H20.5L15,1.5V7M8,0H16L22,6V18A2,2 0 0,1 20,20H8C6.89,20 6,19.1 6,18V2A2,2 0 0,1 8,0M4,4V22H20V24H4A2,2 0 0,1 2,22V4H4Z" />
              </svg>`;
      break;
    case 'development':
    case 'task-development':
      categoryLabel = 'Development';
      icon = `<svg viewBox="0 0 24 24">
                  <path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z" />
              </svg>`;
      break;
    case 'bug-hunting':
    case 'task-bug-hunting':
      categoryLabel = 'Bug Hunting';
      icon = `<svg viewBox="0 0 24 24">
                  <path d="M14,12H10V10H14M14,16H10V14H14M20,8H17.19C16.74,7.22 16.12,6.55 15.37,6.04L17,4.41L15.59,3L13.42,5.17C12.96,5.06 12.5,5 12,5C11.5,5 11.04,5.06 10.59,5.17L8.41,3L7,4.41L8.62,6.04C7.88,6.55 7.26,7.22 6.81,8H4V10H6.09C6.04,10.33 6,10.66 6,11V12H4V14H6V15C6,15.34 6.04,15.67 6.09,16H4V18H6.81C7.85,19.79 9.78,21 12,21C14.22,21 16.15,19.79 17.19,18H20V16H17.91C17.96,15.67 18,15.34 18,15V14H20V12H18V11C18,10.66 17.96,10.33 17.91,10H20V8Z" />
              </svg>`;
      break;
    case 'translations':
    case 'task-translations':
      categoryLabel = 'Translation';
      icon = `<svg viewBox="0 0 24 24">
                  <path d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07M18.5,10H16.5L12,22H14L15.12,19H19.87L21,22H23L18.5,10M15.88,17L17.5,12.67L19.12,17H15.88Z" />
              </svg>`;
      break;
    case 'graphics':
    case 'task-graphics':
      categoryLabel = 'Graphics';
      icon = `<svg viewBox="0 0 24 24">
                  <path d="M20.71,4.63L19.37,3.29C19,2.9 18.35,2.9 17.96,3.29L9,12.25L11.75,15L20.71,6.04C21.1,5.65 21.1,5 20.71,4.63M7,14A3,3 0 0,0 4,17C4,18.31 2.84,19 2,19C2.92,20.22 4.5,21 6,21A4,4 0 0,0 10,17A3,3 0 0,0 7,14Z" />
              </svg>`;
      break;
    case 'analysis':
    case 'task-analysis':
      categoryLabel = 'Analysis';
      icon = `<svg viewBox="0 0 24 24">
                  <path d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z" />
              </svg>`;
      break;
    case 'social':
    case 'task-social':
      categoryLabel = 'Visibility';
      icon = `<svg viewBox="0 0 24 24">
                  <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z" />
              </svg>`;
      break;
    case 'documentation':
    case 'task-documentation':
      categoryLabel = 'Documentation';
      icon = `<svg viewBox="0 0 24 24">
                  <path d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.5 6.5,20.5C8.45,20.5 10.55,20.9 12,22C13.35,21.15 15.8,20.5 17.5,20.5C19.15,20.5 20.85,20.81 22.25,21.56C22.35,21.61 22.4,21.59 22.5,21.59C22.75,21.59 23,21.34 23,21.09V6.5C22.4,6.05 21.75,5.75 21,5.5V7.5L21,13V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,19.15 12,20V13L12,8.5V6.5C10.55,5.4 8.45,5 6.5,5V5Z" />
              </svg>`;
      break;
    case 'tutorials':
    case 'task-tutorials':
      categoryLabel = 'Tutorials';
      icon = `<svg viewBox="0 0 24 24">
                  <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
              </svg>`;
      break;
    case 'video-tutorials':
    case 'task-video-tutorials':
      categoryLabel = 'Video-Tutorials';
      icon = `<svg viewBox="0 0 24 24">
                  <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
              </svg>`;
      break;
    case 'copywriting':
    case 'task-copywriting':
      categoryLabel = 'Copywriting';
      icon = `<svg viewBox="0 0 24 24">
                  <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
              </svg>`;
      break;
  }

  if (contribution.json_metadata.type.indexOf('task-') !== -1) {
    categoryLabel += ' Request'
  }

  return `<div class="contribution"><div class="contribution-inner">
  <div class="category ${contribution.json_metadata.type}">
      ${icon}
      ${categoryLabel}
  </div>
  <div class="user clearfix">
      <div class="profile-image" style="background-image: url('https://img.busy.org/@${contribution.author}?s=30');"></div>
      <a class="username" href="https://utopian.io/@${contribution.author}">${contribution.author}</a>
      <span class="reputation">${helpers.calculateReputation(contribution.author_reputation)}</span>
      <!--<span class="date">${moment.utc(contribution.created).from(moment.utc().format('YYYY-MM-DD HH:mm:ss'))}</span>-->
  </div>
  <div class="title">
      <a href="https://utopian.io${contribution.url}">${contribution.title}</a>
  </div>
  <div class="stats clearfix">
      <div class="float-left mr-2">
          <svg style="width: 16px; height: 16px; margin-top: -1px; vertical-align: middle;" viewBox="0 0 24 24">
              <path fill="#cccccc" d="M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10M1,21H5V9H1V21Z" />
          </svg>
          ${contribution.net_votes}
      </div>
      <div class="float-left">
          <svg style="width: 16px; height: 16px; margin-top: -1px; vertical-align: middle;" viewBox="0 0 24 24">
              <path fill="#cccccc" d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z" />
          </svg>
          ${contribution.children}
      </div>
      <div class="float-right">
          $${helpers.getPostPayout(contribution)}
      </div>
  </div>
</div></div>`;
};

helpers.getPostPayout = (post) => {
  if (post.last_payout === '1970-01-01T00:00:00') {
    let payout = post.pending_payout_value.replace(' SBD', '');
    return parseFloat(payout);
  }

  let authorPayout = post.total_payout_value.replace(' SBD', '');
  let curatorPayout = post.curator_payout_value.replace(' SBD', '');

  return (parseFloat(authorPayout) + parseFloat(curatorPayout)).toFixed(2);
};

helpers.calculateReputation = (rep) => {
  let reputation = ((((Math.log10(Math.abs(rep))) - 9) * 9) + 25);

  return (rep < 0 ? '-' : '') + Math.floor(reputation);
};

module.exports = helpers;
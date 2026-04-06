---
layout: page
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme-without-fonts'

const members = [
  {
    avatar: 'https://www.github.com/yizack.png',
    name: 'Yizack Rangel',
    title: 'Author',
    links: [
      { icon: 'github', link: 'https://github.com/yizack' },
      { icon: 'linkedin', link: 'https://linkedin.com/in/yizack' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/yizack.com' }
    ]
  },
  {
    avatar: 'https://www.github.com/ttulttul.png',
    name: 'Ken Simpson',
    title: 'Contributor',
    links: [
      { icon: 'github', link: 'https://github.com/ttulttul' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/ksimpson' }
    ]
  }
]
</script>

<VPTeamPage style="margin:0">
  <VPTeamPageTitle>
    <template #title>
      Contributors
    </template>
    <template #lead>
      All the people who have contributed to this package.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />
</VPTeamPage>

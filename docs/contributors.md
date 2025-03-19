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
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/yizack' },
      { icon: 'linkedin', link: 'https://linkedin.com/in/yizack' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/yizack.com' }
    ]
  },
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

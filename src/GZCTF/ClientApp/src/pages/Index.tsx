import { Group, Stack, Title, useMantineTheme, Image, Alert, Text, Anchor } from '@mantine/core'
import { mdiFlagCheckered } from '@mdi/js'
import { Icon } from '@mdi/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import MobilePostCard from '@Components/MobilePostCard'
import PostCard from '@Components/PostCard'
import RecentGame from '@Components/RecentGame'
import RecentGameCarousel from '@Components/RecentGameCarousel'
import WithNavBar from '@Components/WithNavbar'
import { showErrorNotification } from '@Utils/ApiHelper'
import { useIsMobile } from '@Utils/ThemeOverride'
import { usePageTitle } from '@Utils/usePageTitle'
import api, { PostInfoModel, GameJoinModel, ParticipationStatus } from '@Api'
import classes from './Index.module.css'
import { useNavigate } from 'react-router-dom'
import '../styles/components/index.css'
import CountdownTimer from './CountdownTimer'
import { useScrollIntoView } from '@mantine/hooks'
import { useModals } from '@mantine/modals'
import { Trans } from 'react-i18next'
import { showNotification } from '@mantine/notifications'
import { mdiAlertCircle, mdiCheck, mdiFlagOutline, mdiTimerSand } from '@mdi/js'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import GameJoinModal from '@Components/GameJoinModal'
import GameProgress from '@Components/GameProgress'
import Markdown from '@Components/MarkdownRenderer'
import { useLanguage } from '@Utils/I18n'
import { getGameStatus, useGame } from '@Utils/useGame'
import { useTeams, useUser } from '@Utils/useUser'

const Home: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [joinModalOpen, setJoinModalOpen] = useState(false)

  const { data: posts, mutate } = api.info.useInfoGetLatestPosts({
    refreshInterval: 5 * 60 * 1000,
  })

  const { data: allGames } = api.game.useGameGamesAll({
    refreshInterval: 5 * 60 * 1000,
  })

  allGames?.sort((a, b) => new Date(a.end!).getTime() - new Date(b.end!).getTime())

  const onTogglePinned = (post: PostInfoModel, setDisabled: (value: boolean) => void) => {
    setDisabled(true)
    api.edit
      .editUpdatePost(post.id, { title: post.title, isPinned: !post.isPinned })
      .then((res) => {
        if (post.isPinned) {
          mutate([
            ...(posts?.filter((p) => p.id !== post.id && p.isPinned) ?? []),
            { ...res.data },
            ...(posts?.filter((p) => p.id !== post.id && !p.isPinned) ?? []),
          ])
        } else {
          mutate([
            { ...res.data },
            ...(posts?.filter((p) => p.id !== post.id && p.isPinned) ?? []),
            ...(posts?.filter((p) => p.id !== post.id && !p.isPinned) ?? []),
          ])
        }
        api.info.mutateInfoGetPosts()
      })
      .catch((e) => showErrorNotification(e, t))
      .finally(() => {
        setDisabled(false)
      })
  }

  const now = new Date()
  const recentGames = [
    ...(allGames?.filter((g) => now < new Date(g.end ?? '')) ?? []),
    ...(allGames?.filter((g) => now >= new Date(g.end ?? '')).reverse() ?? []),
  ].slice(0, 3)

  const theme = useMantineTheme()
  const isMobile = useIsMobile(900)

  usePageTitle()
  const modals = useModals()
  const { user } = useUser()
  const onJoin = () => {
    if (user == undefined) {
      // 刷新当前页面
      navigate('/account/login');
    } else {
      modals.openConfirmModal({
        title: t('game.content.join.confirm'),
        children: (
          <Stack gap="xs">
            <Text size="sm">{t('game.content.join.content.0')}</Text>
            <Text size="sm">
              <Trans i18nKey="game.content.join.content.1" />
            </Text>
            <Text size="sm">
              <Trans i18nKey="game.content.join.content.2" />
            </Text>
          </Stack>
        ),
        onConfirm: () => setJoinModalOpen(true),
        confirmProps: { color: theme.primaryColor },
      })
    }
  }

  // const { id } = useParams()
  let id = null
  let isAfter = null;
  let isAfterStart = null;
  if (recentGames.length != 0) {
    id = recentGames[0].id
    let nowNew = new Date();
    let end = new Date(recentGames[0].end??'')
    let start = new Date(recentGames[0].start??'')
    isAfter = nowNew > end
    isAfterStart = nowNew > start
  }
  const numId = id ?? parseInt('-1')
  // const numId = parseInt(id ?? '-1')

  // const GetAlert = () => {

  const { game, error, status } = useGame(numId)
  const { startTime, endTime, finished, started, progress } = getGameStatus(game)

  const { locale } = useLanguage()
  const { teams } = useTeams()
  console.log(finished, user, teams, ParticipationStatus, status);
  const teamRequire =
    user && status === ParticipationStatus.Unsubmitted && !finished && teams && teams.length === 0
  // }

  const canSubmit =
    (status === ParticipationStatus.Unsubmitted || status === ParticipationStatus.Rejected) &&
    !finished &&
    user &&
    teams &&
    teams.length > 0

  // GetAlert()

  const onSubmitJoin = async (info: GameJoinModel) => {
    try {
      if (!numId) return

      await api.game.gameJoinGame(numId, info)
      showNotification({
        color: 'teal',
        message: t('game.notification.joined'),
        icon: <Icon path={mdiCheck} size={1} />,
      })
      mutate()
      // 刷新当前页面
      window.location.reload();

    } catch (err) {
      return showErrorNotification(err, t)
    }
  }

  return (
    <WithNavBar withFooter withHeader stickyHeader>
      <Stack justify="flex-start">
        {isMobile && recentGames && recentGames.length > 0 && (
          <RecentGameCarousel games={recentGames} />
        )}
        <div className='home'>
          <div className="centent">
            <div className="titleCenter">
              <div className='titleBg'></div>
              <div>使用须知</div>
            </div>
            <div>
              <div style={{ marginTop: "50px" }} className='centent-introduce'>
                <div className='centent-introduce-top'>
                  <div className='centent-introduce-icon'>
                    <div className='centent-introduce-icon-img'></div>
                  </div>
                  <div className='centent-introduce-name'>
                    平台介绍
                  </div>
                </div>
                <div className='centent-introduce-centent'>
                  <div className='centent-introduce-centent-detail'>SnigeCTF 网络安全练习平台是一个内部使用的网络安全练习平台，采用线上CTF解题的形式进行。本平台旨在为网络安全爱好者提供一个高质量的练习环境，通过各种挑战帮助用户提升实战技能和应对网络威胁的能力。无论是初学者还是各位大佬，希望你能够在这里找到适合自己的挑战，一起交流经验，提升技能。
                  </div>
                </div>
              </div>
              <div className='centent-introduce'>
                <div className='centent-introduce-top'>
                  <div className='centent-introduce-icon'>
                    <div className='centent-format-icon-img'></div>
                  </div>
                  <div className='centent-introduce-name'>
                    报名方式
                  </div>
                </div>
                <div className='centent-format-centent'>
                  <div className='centent-format-centent-detail'>
                    <div>练习时间：2024年10月1日-2026年1月1日</div>
                    <div>报名时间：2024年10月1日-2026年1月1日（练习期间可随时报名参加）</div>
                    <div>练习方式：线上个人/团队赛</div>
                    <div>练习方向：Web/Re/Pwn/Crypto/Misc</div>
                    <div>排名机制：采用动态积分制，按照积分从高到低排名，两队相同积分时以先达到该积分的先后顺序排名。</div>
                  </div>
                </div>
              </div>
              <div className='centent-introduce'>
                <div className='centent-introduce-top'>
                  <div className='centent-introduce-icon'>
                    <div className='centent-company-icon-img'></div>
                  </div>
                  <div className='centent-introduce-name'>
                    相关说明
                  </div>
                </div>
                <div className='centent-match-centent'>
                  <div className='centent-match-centent-detail'>
                    <div>1. 禁止所有破坏练习公平公正的行为，包括但不限于：私自传播flag、对练习平台及选手进行攻击，一经发现将被取消练习资格。</div>
                    <div>2. 本次练习面向所有受邀请用户，可联系管理员获得邀请码参加练习。</div>
                    <div>3. 依照 AGPLv3在&nbsp;&lt; https://github.com/1-r1ce/GZCTF &gt;&nbsp;开源。 </div>
                    <div>4. 本平台的最终解释权归本人所有。</div>
                  </div>
                </div>
              </div>
              <div className='centent-introduce'>
                <div className='centent-introduce-top'>
                  <div className='centent-introduce-icon'>
                    <div className='centent-company-icon-img'></div>
                  </div>
                  <div className='centent-introduce-name'>
                    联系方式
                  </div>
                </div>
                <div className='centent-company-centent'>
                  <div className='centent-company-centent-detail'>
                    <div>交流qq群：953072843</div>
                    <div>联系邮箱：rekir@qq.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div>

        </div> */}
          <Stack align="center">
            <Group wrap="nowrap" gap={4} justify="space-between" align="flex-start" w="100%">
              {/* <Stack className={classes.posts}>
              {isMobile
                ? posts?.map((post) => (
                    <MobilePostCard key={post.id} post={post} onTogglePinned={onTogglePinned} />
                  ))
                : posts?.map((post) => (
                    <PostCard key={post.id} post={post} onTogglePinned={onTogglePinned} />
                  ))}
            </Stack> */}
              {!isMobile && (
                // <nav className={classes.wrapper}>
                <div className='Participate'>
                  {recentGames.length != 0 && (recentGames[0].poster != null ? <Image src={recentGames[0].poster} className='Participate-img' alt="poster" /> : <div className='Participate-img'><Icon
                    path={mdiFlagCheckered}
                    size={1.5}
                    color={theme.colors[theme.primaryColor][4]}
                  /></div>)}
                  <CountdownTimer></CountdownTimer>
                  {/* <Stack> */}
                  {/* <Group>
                      <Icon
                        path={mdiFlagCheckered}
                        size={1.5}
                        color={theme.colors[theme.primaryColor][4]}
                      />
                      <Title order={3}>{t('common.content.home.recent_games')}</Title>
                    </Group> */}
                  {isAfter && <div className='button' style={{ backgroundColor: '#ccc' }}>练习结束</div>}
                  {status == 'Accepted' && !isAfter && isAfterStart && <div className='button' onClick={() => navigate(`/games/${numId}/challenges`)}>进入练习</div>}
                  {status == 'Accepted' && !isAfter && !isAfterStart && <div className='button' style={{ backgroundColor: '#ccc' }}>即将开赛</div>}
                  {status == 'Unsubmitted' && teams?.length == 0 && !isAfter && <div className='button' style={{ backgroundColor: '#ccc' }}>立即报名</div>}
                  {status == 'Unsubmitted' && teams?.length != 0 && !isAfter && <div className='button' onClick={onJoin}>立即报名</div>}
                  {status == 'Pending' && !isAfter && <div className='button' style={{ backgroundColor: '#ccc' }}>审核中</div>}
                  {status == 'Rejected' && !isAfter && <div className='button' onClick={onJoin}>立即参赛</div>}
                  {status == 'Suspended' && !isAfter && <div className='button' style={{ backgroundColor: '#ccc' }}>禁赛中</div>}
                  <div style={{ marginTop: "5%" }}>
                    {/* </Stack> */}
                    {status == 'Unsubmitted' && teams?.length == 0 && (
                      <Alert
                        color="#0066CC"
                        icon={<Icon path={mdiAlertCircle} />}
                        title={t('game.participation.alert.team_required.title')}
                      >
                        <Trans i18nKey="game.participation.alert.team_required.content">
                          _
                          <Anchor component={Link} to="/teams">
                            _
                          </Anchor>
                          _
                        </Trans>
                      </Alert>
                    )}
                    {status === 'Rejected' && (
                      <Alert
                        color="red"
                        icon={<Icon path={mdiAlertCircle} />}
                        title={t('game.participation.alert.rejected.title')}
                      >
                        {t('game.participation.alert.rejected.content')}
                      </Alert>
                    )}
                  </div>
                  <div className='communication'>
                    <div>
                      学习交流：
                    </div>
                    <div className='communication-centent'>
                      <div style={{ display: "flex", alignItems: 'center' }}>
                        <div className='communication-centent-img1'></div>
                        <div className='communication-centent-text'>
                          <div>交流qq群</div>
                          <div>953072843</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: 'center' }}>
                        <div className='communication-centent-img2'></div>
                        <div className='communication-centent-text'>
                          <div>联系邮箱</div>
                          <div>rekir@qq.com</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                // </nav>
              )}
            </Group>
          </Stack>
        </div>
      </Stack>
      <GameJoinModal
        title={t('game.content.join.title')}
        opened={joinModalOpen}
        withCloseButton={false}
        onClose={() => setJoinModalOpen(false)}
        onSubmitJoin={onSubmitJoin}
      />
    </WithNavBar>
  )
}

export default Home

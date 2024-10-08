﻿using GZCTF.Models.Request.Game;

namespace GZCTF.Repositories.Interface;

public interface IGameRepository : IRepository
{
    /// <summary>
    /// 获取指定数量的练习对象基本信息
    /// </summary>
    /// <param name="count"></param>
    /// <param name="skip"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    public Task<BasicGameInfoModel[]> GetBasicGameInfo(int count = 10, int skip = 0, CancellationToken token = default);

    /// <summary>
    /// 获取指定数量的练习对象
    /// </summary>
    /// <param name="count"></param>
    /// <param name="skip"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    public Task<Game[]> GetGames(int count = 10, int skip = 0, CancellationToken token = default);

    /// <summary>
    /// 获取最近将要开始的练习 id
    /// </summary>
    /// <param name="token"></param>
    /// <returns></returns>
    public Task<int[]> GetUpcomingGames(CancellationToken token = default);

    /// <summary>
    /// 根据Id获取练习对象
    /// </summary>
    /// <param name="id">练习Id</param>
    /// <param name="token"></param>
    /// <returns></returns>
    public Task<Game?> GetGameById(int id, CancellationToken token = default);

    /// <summary>
    /// 创建练习对象
    /// </summary>
    /// <param name="game">练习对象</param>
    /// <param name="token"></param>
    /// <returns></returns>
    public Task<Game?> CreateGame(Game game, CancellationToken token = default);

    /// <summary>
    /// 获取队伍Token
    /// </summary>
    /// <param name="game">练习对象</param>
    /// <param name="team">参赛队伍对象</param>
    /// <returns></returns>
    public string GetToken(Game game, Team team);

    /// <summary>
    /// 获取排行榜
    /// </summary>
    /// <param name="game">练习对象</param>
    /// <param name="token"></param>
    /// <returns></returns>
    public Task<ScoreboardModel> GetScoreboard(Game game, CancellationToken token = default);

    /// <summary>
    /// 获取带有队伍成员信息的排行榜
    /// </summary>
    /// <param name="game">练习对象</param>
    /// <param name="token"></param>
    /// <returns></returns>
    public Task<ScoreboardModel> GetScoreboardWithMembers(Game game, CancellationToken token = default);

    /// <summary>
    /// 删除练习
    /// </summary>
    /// <param name="game">练习对象</param>
    /// <param name="token"></param>
    /// <returns></returns>
    public Task<TaskStatus> DeleteGame(Game game, CancellationToken token = default);

    /// <summary>
    /// 删除练习的全部 WriteUp
    /// </summary>
    /// <param name="game">练习对象</param>
    /// <param name="token"></param>
    /// <returns></returns>
    public Task DeleteAllWriteUps(Game game, CancellationToken token = default);

    /// <summary>
    /// 生成排行榜
    /// </summary>
    /// <param name="game">练习对象</param>
    /// <param name="token"></param>
    public Task<ScoreboardModel> GenScoreboard(Game game, CancellationToken token = default);

    /// <summary>
    /// 刷新练习信息缓存
    /// </summary>
    public void FlushGameInfoCache();
}

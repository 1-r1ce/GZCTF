namespace GZCTF.Hubs.Clients;

public interface IMonitorClient
{
    /// <summary>
    /// 接收到练习事件信息
    /// </summary>
    public Task ReceivedGameEvent(GameEvent gameEvent);

    /// <summary>
    /// 接收到练习提交信息
    /// </summary>
    public Task ReceivedSubmissions(Submission submission);
}

namespace GZCTF.Hubs.Clients;

public interface IUserClient
{
    /// <summary>
    /// 接收到练习通知信息
    /// </summary>
    public Task ReceivedGameNotice(GameNotice notice);
}

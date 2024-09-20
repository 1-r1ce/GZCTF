using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GZCTF.Models.Request.Edit;

/// <summary>
/// 练习信息（Edit）
/// </summary>
public class GameInfoModel
{
    /// <summary>
    /// 练习 Id
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// 练习标题
    /// </summary>
    [Required]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// 是否隐藏
    /// </summary>
    public bool Hidden { get; set; }

    /// <summary>
    /// 练习描述
    /// </summary>
    public string Summary { get; set; } = string.Empty;

    /// <summary>
    /// 练习详细介绍
    /// </summary>
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// 报名队伍免审核
    /// </summary>
    public bool AcceptWithoutReview { get; set; }

    /// <summary>
    /// 是否需要提交 Writeup
    /// </summary>
    public bool WriteupRequired { get; set; }

    /// <summary>
    /// 练习邀请码
    /// </summary>
    [MaxLength(Limits.InviteTokenLength,
        ErrorMessageResourceName = nameof(Resources.Program.Model_InvitationCodeTooLong),
        ErrorMessageResourceType = typeof(Resources.Program))]
    public string? InviteCode { get; set; }

    /// <summary>
    /// 参赛所属单位列表
    /// </summary>
    public Dictionary<string, string?>? Organizations { get; set; }

    /// <summary>
    /// 队员数量限制, 0 为无上限
    /// </summary>
    public int TeamMemberCountLimit { get; set; }

    /// <summary>
    /// 队伍同时开启的容器数量限制
    /// </summary>
    public int ContainerCountLimit { get; set; } = 3;

    /// <summary>
    /// 练习头图
    /// </summary>
    [JsonPropertyName("poster")]
    public string? PosterUrl { get; set; } = string.Empty;

    /// <summary>
    /// 练习签名公钥
    /// </summary>
    public string PublicKey { get; set; } = string.Empty;

    /// <summary>
    /// 练习是否为练习模式（练习结束够依然可以访问）
    /// </summary>
    public bool PracticeMode { get; set; } = true;

    /// <summary>
    /// 开始时间
    /// </summary>
    [Required]
    [JsonPropertyName("start")]
    public DateTimeOffset StartTimeUtc { get; set; } = DateTimeOffset.FromUnixTimeSeconds(0);

    /// <summary>
    /// 结束时间
    /// </summary>
    [Required]
    [JsonPropertyName("end")]
    public DateTimeOffset EndTimeUtc { get; set; } = DateTimeOffset.FromUnixTimeSeconds(0);

    /// <summary>
    /// Writeup 提交截止时间
    /// </summary>
    public DateTimeOffset WriteupDeadline { get; set; } = DateTimeOffset.UtcNow;

    /// <summary>
    /// Writeup 附加说明
    /// </summary>
    public string WriteupNote { get; set; } = string.Empty;

    /// <summary>
    /// 三血加分
    /// </summary>
    [JsonPropertyName("bloodBonus")]
    public long BloodBonusValue { get; set; } = BloodBonus.DefaultValue;

    internal static GameInfoModel FromGame(Data.Game game) =>
        new()
        {
            Id = game.Id,
            Title = game.Title,
            Summary = game.Summary,
            Content = game.Content,
            Hidden = game.Hidden,
            PracticeMode = game.PracticeMode,
            PosterUrl = game.PosterUrl,
            InviteCode = game.InviteCode,
            PublicKey = game.PublicKey,
            Organizations = game.Organizations,
            AcceptWithoutReview = game.AcceptWithoutReview,
            TeamMemberCountLimit = game.TeamMemberCountLimit,
            ContainerCountLimit = game.ContainerCountLimit,
            StartTimeUtc = game.StartTimeUtc,
            EndTimeUtc = game.EndTimeUtc,
            WriteupDeadline = game.WriteupDeadline,
            WriteupNote = game.WriteupNote,
            WriteupRequired = game.WriteupRequired,
            BloodBonusValue = game.BloodBonus.Val
        };
}

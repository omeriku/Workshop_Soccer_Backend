CREATE TABLE [dbo].[games](
	[game_id] [int] IDENTITY(1,1) NOT NULL,
	[home_team_id] [INT](100) NOT NULL,
	[away_team_id] [INT](100) NOT NULL,
	[date] [DATETIME] NOT NULL,
	[goals_home_team] [INT](100) NOT NULL,
	[goals_away_team] [INT](100) NOT NULL,
	[field] varchar(100) NOT NULL
);
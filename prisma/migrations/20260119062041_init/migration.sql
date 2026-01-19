BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[tasks] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(1000),
    [completed] BIT NOT NULL CONSTRAINT [tasks_completed_df] DEFAULT 0,
    [priority] NVARCHAR(1000) NOT NULL CONSTRAINT [tasks_priority_df] DEFAULT 'medium',
    [version] INT NOT NULL CONSTRAINT [tasks_version_df] DEFAULT 1,
    [clientId] NVARCHAR(100),
    [lastSyncAt] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [tasks_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    CONSTRAINT [tasks_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[sync_logs] (
    [id] NVARCHAR(1000) NOT NULL,
    [entityType] NVARCHAR(50) NOT NULL,
    [entityId] NVARCHAR(100) NOT NULL,
    [operation] NVARCHAR(20) NOT NULL,
    [clientId] NVARCHAR(100) NOT NULL,
    [syncedAt] DATETIME2 NOT NULL CONSTRAINT [sync_logs_syncedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [data] NVARCHAR(max) NOT NULL,
    CONSTRAINT [sync_logs_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [tasks_clientId_idx] ON [dbo].[tasks]([clientId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [tasks_updatedAt_idx] ON [dbo].[tasks]([updatedAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [sync_logs_clientId_syncedAt_idx] ON [dbo].[sync_logs]([clientId], [syncedAt]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

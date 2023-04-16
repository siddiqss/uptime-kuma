BEGIN TRANSACTION;

ALTER TABLE monitor
    ADD index_status INTEGER default null;

COMMIT;
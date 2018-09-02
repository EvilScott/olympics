#!/usr/bin/env bash
pg_restore -d postgres --create /docker-entrypoint-initdb.d/olympics.dump

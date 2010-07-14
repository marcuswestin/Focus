all: lib/fin lib/less.js

############
### Cmds ###
############

.PHONY: run
run: lib/fin
	redis-server redis.conf &> run-redis-server.out &
	cd lib/fin/; node run_query_observer.js &> ../../run-node-query-observer.out &
	node node_scripts/run_server.js &> run-node-server.out &

.PHONY: stop-tasks
stop:
	killall node
	killall redis-server

.PHONY: restart-tasks
restart: stop run

####################
### Dependencies ###
####################

.PHONY: clean
clean:
	rm run-*.out
	rm -rf lib/*
	touch lib/empty.txt

lib/fin:
	git clone git://github.com/marcuswestin/fin.git lib/fin
	cd lib/fin; make

lib/less.js:
	curl http://lesscss.googlecode.com/files/less-1.0.18.min.js > lib/less.js

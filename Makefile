############
### Apps ###
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

.PHONY: deps
deps: lib/fin

.PHONY: clean
clean:
	rm run-*.out
	rm -rf lib/*
	touch lib/empty.txt

lib/fin:
	git clone git://github.com/marcuswestin/fin.git
	mv ./fin lib/
	cd lib/fin; make download-dependencies

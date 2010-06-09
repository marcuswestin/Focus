############
### Apps ###
############

.PHONY: run-tasks
run-tasks:
	redis-server lib/fin/redis.conf &
	cd lib/fin/; node run_query_observer.js &
	node run_server.js &

.PHONY: stop-tasks
stop-tasks:
	killall node
	killall redis-server

.PHONY: restart-tasks
restart-tasks: stop-tasks run-tasks

####################
### Dependencies ###
####################

.PHONY: deps
deps: lib/fin lib/raphael lib/g.raphael

.PHONY: clean
clean:
	rm -rf lib/*
	touch lib/empty.txt

lib/fin:
	git clone git://github.com/marcuswestin/fin.git
	mv ./fin lib/
	cd lib/fin; make download-dependencies

.PHONY: run deps

#################
### Utilities ###
#################

run:
	make -C lib/fin run



####################
### Dependencies ###
####################

deps: lib/fin

lib/fin:
	git clone git://github.com/marcuswestin/fin.git
	mv -f ./fin lib/
	cd lib/fin; make deps

#!/bin/bash
#
# Create a large DID Document and compress it

# Create example
../didcel -c create -c save -c quit
mv did.cel create.cel

# Witness example
../didcel -c create -c witness -c save -c quit
mv did.cel witness.cel

# Update example
../didcel -c create -c witness -c "add authentication ecdsa" -c update -c witness -c save -c quit
mv did.cel update.cel

# Heartbeat example
../didcel -c create -c witness -c heartbeat -c witness -c save -c quit
mv did.cel heartbeat.cel

# Deactivate example
../didcel -c create -c witness -c "add authentication ecdsa" -c update -c witness -c deactivate -c witness -c save -c quit
mv did.cel deactivate.cel

# 30 year personal did:cel
../didcel -c create -c witness \
          -c "add authentication ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c heartbeat -c witness \
          -c ls -c save -c quit
mv did.cel 30-year-personal.cel

# 30 year organization did:cel
../didcel -c create -c witness \
          -c "add authentication ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c "add authentication ecdsa" -c "add assertionMethod ecdsa" -c update -c witness \
          -c ls -c save -c quit
mv did.cel 30-year-organization.cel

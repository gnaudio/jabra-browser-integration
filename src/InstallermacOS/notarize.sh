#!/bin/sh

# Script to notarize a file or bundle.
# Largely based on https://github.com/adib/DiskImageDistribution/blob/master/BuildScripts/make_disk_image.sh


usage() {
  echo "Usage: $0 -u <APPLE ID> -p <APPLE APP SPECIFIC PASSWORD> -f <PATH TO DMG> -b <PRIMARY BUNDLE ID>" 1>&2 
}

# Parse command line arguments
OPTIND=1         # Reset in case getopts has been used previously in the shell.

while getopts ":u:p:f:b:" opt; do
    case "$opt" in
    \?)
		echo "Invalid option: -$OPTARG" >&2
		usage
        exit 1
        ;;
    p)  password=$OPTARG
        ;;
    u)  username=$OPTARG
        ;;
    f)  source_file=$OPTARG
        ;;
    b)  primary_bundle_id=$OPTARG
        ;;
    esac
done

set -e # Fail if any command fails
# set -x # List the commands being run

# Check arguments
if [ -z "${password}" ] || [ -z "${username}" ] || [ -z "${source_file}" ] || [ -z "${primary_bundle_id}" ]; then
	usage
	exit 1
fi

# Compress the source if it's a bundle
original_source_file="${source_file}"
if [ -d "${source_file}" ]; then
	zip_dir=`mktemp -d`
	zip_file="${zip_dir}/bundle.zip"
	ditto -ck --rsrc --sequesterRsrc --keepParent "${source_file}" "${zip_file}"
	source_file="${zip_file}"
fi

# Upload to Apple

echo "Uploading for notarization..."

output_file=`mktemp`

xcrun altool --notarize-app \
	--primary-bundle-id "${primary_bundle_id}" \
	-u "${username}" \
	-p "${password}" \
	--output-format xml \
	--file "${source_file}" \
	> "${output_file}" | true

notarize_exit=${PIPESTATUS[0]}
if [ "${notarize_exit}" != "0" ]
then
	echo "Notarization failed: ${notarize_exit}"
	cat "${output_file}"
	exit 1
fi

# Parse output, get RequestUUID
plist_buddy="/usr/libexec/PlistBuddy"
request_uuid="$("${plist_buddy}" -c "Print notarization-upload:RequestUUID"  "${output_file}")"
echo
printf "Notarization UUID: ${request_uuid}\nResult: `"${plist_buddy}" -c "Print success-message"  "${output_file}"`\n"


# Wait for notarization result
echo
echo "Waiting for notarization to complete"
output_file=`mktemp`
tries=0
max_tries=10
for (( ; ; ))
do
	((++tries))
	xcrun altool --notarization-info "${request_uuid}" \
	-u "${username}" \
	-p "${password}" \
	--output-format xml \
	> "${output_file}" | true

	notarize_exit=${PIPESTATUS[0]}
	if [ "${notarize_exit}" != "0" ] && [ "$tries" -lt "$max_tries" ]
	then
		echo "Failed to get notarization info: ${notarize_exit}. Trying again."
		cat "${output_file}"
		sleep 10
		continue
	fi
	
	if [ "${notarize_exit}" != "0" ]
	then
		echo "Failed to get notarization info: ${notarize_exit}. Giving up."
		cat "${output_file}"
		exit 1
	fi

	notarize_status="$("${plist_buddy}" -c "Print notarization-info:Status"  "${output_file}")"
	if [ "${notarize_status}" == "in progress" ]
	then
        echo "Waiting for notarization to complete"
        sleep 10
    else
    	echo "Notarization status: ${notarize_status}"
    	break
	fi
done

# Notarization done, look at output
echo 
notarization_log_url="$("${plist_buddy}" -c "Print notarization-info:LogFileURL"  "${output_file}")"
echo "Notarization log URL: ${notarization_log_url}"
if [ "${notarize_status}" != "success" ]
then
	echo "Notarization failed."
	if [ ! -z "${notarization_log_url}" ]
	then
		curl "${notarization_log_url}"
	fi
	exit 1
fi

# Success! STAPLE IT

echo
echo "Stapling notarization result..."
for (( ; ; ))
do
    xcrun stapler staple -q "${original_source_file}" | true
    stapler_status=${PIPESTATUS[0]}
    if [ "${stapler_status}" = "65" ]
    then
        echo "Waiting for stapling to find record"
        sleep 10
	elif [ "${stapler_status}" = "0" ]
	then
		break
    else
        echo "Stapler failed. Status: ${stapler_status}"
        exit 1
    fi
done

echo "All done"
exit 0


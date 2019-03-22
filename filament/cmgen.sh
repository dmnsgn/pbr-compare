CMGEN_PATH=~/Downloads/filament/bin/
INPUT_PATH=../assets/Pisa/
OUTPUT_PATH=../assets/filament/
ENV_MAP_NAME=pisa

rm -rf ${OUTPUT_PATH}${ENV_MAP_NAME}

INPUT_FILE=${INPUT_PATH}${ENV_MAP_NAME}.hdr

# Removed: --extract-blur=0.5

# Create S3TC variant of the IBL, then rename it to have a _s3tc suffix.
${CMGEN_PATH}cmgen -x . --format=ktx --size=256 --compression=s3tc_rgba_dxt5 ${INPUT_FILE}
cd ${ENV_MAP_NAME}* ; mv ${ENV_MAP_NAME}*_ibl.ktx ${ENV_MAP_NAME}_ibl_s3tc.ktx ; cd -

# Create ETC variant of the IBL, then rename it to have a _s3tc suffix.
${CMGEN_PATH}cmgen -x . --format=ktx --size=256 --compression=etc_rgba8_rgba_40 ${INPUT_FILE}
cd ${ENV_MAP_NAME}* ; mv ${ENV_MAP_NAME}*_ibl.ktx ${ENV_MAP_NAME}_ibl_etc.ktx ; cd -

# Create small uncompressed Skybox variant, then rename it to have a _tiny suffix.
${CMGEN_PATH}cmgen -x . --format=ktx --size=64 ${INPUT_FILE}
cd ${ENV_MAP_NAME}* ; mv ${ENV_MAP_NAME}*_ibl.ktx ${ENV_MAP_NAME}_skybox_tiny.ktx ; cd -

# Create full-size uncompressed Skybox and IBL
${CMGEN_PATH}cmgen -x . --format=ktx --size=256 ${INPUT_FILE}

mv ./${ENV_MAP_NAME}/ ${OUTPUT_PATH}

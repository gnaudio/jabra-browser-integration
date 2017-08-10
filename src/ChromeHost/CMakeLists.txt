cmake_policy(SET CMP0015 NEW)

project (jabrachromehost)
  
file(GLOB_RECURSE sources *.cpp *.h *.hpp)

add_compile_options(-std=c++11)
if(WIN32)
  add_compile_options(/MT)
endif()

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/bin)

if(WIN32)
  link_directories("./SDKWindows")
endif()

if(APPLE)
  link_directories("./SDKmacOS")
endif()

add_executable(jabrachromehost ${sources})

if(WIN32)
  target_link_libraries(jabrachromehost PUBLIC libjabra)
endif()

if(APPLE)
  target_link_libraries(jabrachromehost PUBLIC jabra)
endif()

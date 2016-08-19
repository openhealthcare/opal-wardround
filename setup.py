import os
from setuptools import setup

long_desc = """
OPAL Wardround is a plugin for the OPAL web framework that provides virtual wardround and MDT
functionality.

Source code and documentation available at https://github.com/openhealthcare/opal-wardround/
"""

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
    name='opal-wardround',
    version='0.7.1',
    packages=['wardround'],
    include_package_data=True,
    license='GPL3',
    description='OPAL Plugin for (Virtual) Ward Rounds and MDTs',
    long_description=long_desc,
    url='http://opal.openhealthcare.org.uk/',
    author='Open Health Care UK',
    author_email='hello@openhealthcare.org.uk',
)

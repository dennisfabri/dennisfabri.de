#!/usr/bin/perl
use strict;
use warnings;

use File::Copy;

print "Preparing\n";
my $builddirectory = "build";
unless(-e $builddirectory or mkdir $builddirectory) {
    die "Unable to create $builddirectory\n";
}

print "Copying resources\n";
copy("src/html/punkterechner.html","build/index.html") or die "Copy failed: $!";
copy("node_modules/chart.js/dist/Chart.bundle.min.js","build") or die "Copy failed: $!";
copy("node_modules/chart.js/dist/Chart.bundle.js","build") or die "Copy failed: $!";

print "Compiling\n";
system("npx tsc");

print "Bundling\n";

my $directory = "./build/js/";
my @filenames = ("Types", "Sexes", "Record", "Discipline", "Agegroup", "Year", "Calculator", "TimesHistory", "Controller", "RecordsHistory", "Rechner");

my $outputfilename = "./build/calculator.bundle.js";

open(my $output, '>', $outputfilename) or die("Could not open $outputfilename: $!");

for (my $x = 0; $x < @filenames; $x++) {
    my $filename = $directory . $filenames[$x] . ".js";
    # print "  $filename\n";

    open(my $file, $filename) or die("Could not open $filename: $!");
    while( my $line = <$file>)  {
        if ($line =~ /^export (.*)$/) {
            $line = "$1\n";
        } elsif ($line =~ /^import (.*)$/) {
            $line = "";
        }
        print $output $line;
    }
    close($file);
}

close($output);

copy("./src/md/punkterechner.md","./build/punkterechner.md") or die "Copy failed: $!";

print "Updating jekyll pages\n";

copy("./build/punkterechner.md","../web/pages/rettungssport/punkterechner.md") or die "Copy failed: $!";
copy("./build/Chart.bundle.min.js","../web/assets/js/Chart.bundle.min.js") or die "Copy failed: $!";
copy("./build/calculator.bundle.js","../web/assets/js/calculator.bundle.js") or die "Copy failed: $!";

print "Finished\n";
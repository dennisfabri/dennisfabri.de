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

print "Generating sources\n";
system("php src/php/data.php");

print "Compiling\n";
system("tsc");

print "Bundling\n";

my $directory = "./build/js/";
my @filenames = ("Types", "Sexes", "Record", "Discipline", "Agegroup", "Year", "Calculator", "Controller", "Data", "Rechner");

my $outputfilename = "./build/bundle.js";

open(my $output, '>', $outputfilename) or die("Could not open $outputfilename: $!");

for (my $x = 0; $x < @filenames; $x++) {
    my $filename = $directory . $filenames[$x] . ".js";
    print "  $filename\n";

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

$outputfilename = "./build/punkterechner.md";

open($output, '>', $outputfilename) or die("Could not open $outputfilename: $!");

{
    my $filename = "src/content.md";
    open(my $file, $filename) or die("Could not open $filename: $!");
    while( my $line = <$file>)  {
        print $output $line;
    }
    close($file);
}

print $output "\n";
print $output "<script>\n";

{
    my $filename = "build/bundle.js";
    open(my $file, $filename) or die("Could not open $filename: $!");
    while( my $line = <$file>)  {
        print $output $line;
    }
    close($file);
}

print $output "</script>\n";


print "Finished\n";